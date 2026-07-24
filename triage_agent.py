#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
triage_agent.py — Agent de triage IA pour DefectDojo (PFE DevSecOps "sécurité continue").

Lit les findings actifs du produit flint_commerce dans DefectDojo, les enrichit
(EPSS + CISA KEV pour les CVE), les triage avec Ollama qwen2.5:7b (détection de
faux positifs / secrets / SAST), réécrit dans DefectDojo (false_p + note d'audit),
et produit un rapport Markdown priorisé + un résumé de métriques en console.

100% bibliothèque standard (urllib) — AUCUN pip requis sur la VM Ubuntu 24.04
(évite l'erreur PEP 668 "externally-managed-environment").

Usage :
    export DD_URL=http://localhost:8080
    export DD_API_TOKEN=<token>
    export OLLAMA_URL=http://localhost:11434
    export OLLAMA_MODEL=qwen2.5:7b
    python3 triage_agent.py --dry-run        # lecture seule (DÉFAUT)
    python3 triage_agent.py --write          # active la réécriture DefectDojo
    python3 triage_agent.py --write --limit 20
"""

import argparse
import json
import os
import re
import sys
import time
import urllib.error
import urllib.request

# ---------------------------------------------------------------------------
# Configuration (variables d'environnement)
# ---------------------------------------------------------------------------

KEV_URL = ("https://www.cisa.gov/sites/default/files/feeds/"
           "known_exploited_vulnerabilities.json")
EPSS_URL = "https://api.first.org/data/v1/epss"
KEV_CACHE_PATH = "/tmp/kev_cache.json"
KEV_CACHE_TTL = 24 * 3600          # 24 h
AI_NOTE_SENTINEL = "[AI-TRIAGE]"   # préfixe de note pour l'idempotence
UA = "flint-triage-agent/1.0"


def load_config():
    """Charge la config depuis l'environnement ; échec rapide si le token manque."""
    cfg = {
        "DD_URL":       os.environ.get("DD_URL", "http://localhost:8080").rstrip("/"),
        "DD_API_TOKEN": os.environ.get("DD_API_TOKEN", ""),
        "OLLAMA_URL":   os.environ.get("OLLAMA_URL", "http://localhost:11434").rstrip("/"),
        "OLLAMA_MODEL": os.environ.get("OLLAMA_MODEL", "qwen2.5:7b"),
        "PRODUCT":      os.environ.get("DD_PRODUCT", "flint_commerce"),
        "SLACK_WEBHOOK_URL": os.environ.get("SLACK_WEBHOOK_URL", ""),
    }
    if not cfg["DD_API_TOKEN"]:
        sys.exit("FATAL : la variable d'environnement DD_API_TOKEN est obligatoire.")
    return cfg


# ---------------------------------------------------------------------------
# Helper HTTP générique (urllib, avec retry/backoff)
# ---------------------------------------------------------------------------

def _http(method, url, headers=None, payload=None, timeout=30, retries=3):
    """Requête HTTP unitaire. Renvoie (code, objet_json|texte). Retry sur 429/5xx."""
    headers = dict(headers or {})
    data = json.dumps(payload).encode("utf-8") if payload is not None else None
    if data is not None:
        headers.setdefault("Content-Type", "application/json")
    headers.setdefault("User-Agent", UA)

    last = None
    for attempt in range(retries):
        req = urllib.request.Request(url, data=data, headers=headers, method=method)
        try:
            with urllib.request.urlopen(req, timeout=timeout) as r:
                body = r.read().decode("utf-8", "replace")
                try:
                    return r.status, json.loads(body) if body else {}
                except json.JSONDecodeError:
                    return r.status, body
        except urllib.error.HTTPError as e:
            detail = e.read().decode("utf-8", "replace")[:300]
            last = f"HTTP {e.code}: {detail}"
            if e.code in (429, 500, 502, 503, 504):
                time.sleep(2 ** attempt)
                continue
            return e.code, detail
        except (urllib.error.URLError, TimeoutError, OSError) as e:
            last = str(getattr(e, "reason", e))
            time.sleep(2 ** attempt)
    raise RuntimeError(f"{method} {url} a échoué après {retries} essais -> {last}")


def _dd_headers(cfg):
    return {
        "Authorization": f"Token {cfg['DD_API_TOKEN']}",
        "Accept": "application/json",
    }


# ---------------------------------------------------------------------------
# Pré-vérifications (échouer en 2 s, pas après 20 min de boucle)
# ---------------------------------------------------------------------------

def preflight(cfg):
    """Valide le token DefectDojo et la présence du modèle Ollama avant la boucle."""
    # 1) Token DefectDojo : un petit GET doit renvoyer 200.
    try:
        code, _ = _http("GET", f"{cfg['DD_URL']}/api/v2/findings/?limit=1",
                        headers=_dd_headers(cfg), timeout=15)
        if code == 401:
            sys.exit("FATAL : DD_API_TOKEN invalide/expiré (401 depuis DefectDojo).")
        if code >= 400:
            sys.exit(f"FATAL : DefectDojo a répondu {code} sur /api/v2/findings/.")
    except RuntimeError as e:
        sys.exit(f"FATAL : DefectDojo injoignable à {cfg['DD_URL']} -> {e}")

    # 2) Modèle Ollama : doit figurer dans /api/tags.
    try:
        code, tags = _http("GET", f"{cfg['OLLAMA_URL']}/api/tags", timeout=15)
        names = [m.get("name", "") for m in (tags.get("models", []) if isinstance(tags, dict) else [])]
        want = cfg["OLLAMA_MODEL"]
        if not any(n == want or n.split(":")[0] == want.split(":")[0] for n in names):
            print(f"[preflight] AVERTISSEMENT : modèle '{want}' absent de /api/tags "
                  f"({names}). Le triage basculera en repli déterministe.")
        else:
            print(f"[preflight] OK : modèle Ollama '{want}' disponible.")
    except RuntimeError as e:
        print(f"[preflight] AVERTISSEMENT : Ollama injoignable à {cfg['OLLAMA_URL']} "
              f"-> {e}. Repli déterministe pour tous les findings.")
    print("[preflight] OK : token DefectDojo valide.")


# ---------------------------------------------------------------------------
# TÂCHE A — Lecture des findings DefectDojo (paginée)
# ---------------------------------------------------------------------------

def fetch_findings(cfg):
    """Récupère tous les findings ACTIFS du produit, en suivant la pagination DRF."""
    base = (f"{cfg['DD_URL']}/api/v2/findings/"
            f"?product_name={urllib.parse.quote(cfg['PRODUCT'])}"
            f"&active=true&related_fields=true&limit=100&offset=0")
    url = base
    findings, total = [], None
    while url:
        code, data = _http("GET", url, headers=_dd_headers(cfg), timeout=30)
        if code >= 400 or not isinstance(data, dict):
            raise RuntimeError(f"Lecture findings échouée ({code}) : {data}")
        if total is None:
            total = data.get("count")
        findings.extend(data.get("results", []))
        url = data.get("next")     # DRF fournit l'URL complète avec les bons params
    print(f"[read] {len(findings)} findings actifs récupérés "
          f"(count API = {total}).")
    return findings


def extract_cves(f):
    """Extrait les identifiants d'avis de vulnérabilité (CVE **et GHSA**) du finding.
    Sert (1) à l'enrichissement EPSS/KEV (CVE seulement) et (2) au garde-fou
    « un finding portant un identifiant de vuln connu n'est JAMAIS un faux positif ».
    Le champ scalaire 'cve' étant exclu du sérialiseur DefectDojo, on lit
    vulnerability_ids + un repli regex sur le titre/description."""
    ids = []
    for v in (f.get("vulnerability_ids") or []):
        vid = (v.get("vulnerability_id") or "").strip().upper()
        if (vid.startswith("CVE-") or vid.startswith("GHSA-")) and vid not in ids:
            ids.append(vid)
    # Repli : identifiants présents dans le titre/description (certains scanners
    # ne remplissent pas vulnerability_ids) -> évite qu'une vraie vuln parte au LLM
    # ou soit faussement classée FP par le repli déterministe (cas Nodemailer/GHSA).
    pat = r"(?:CVE-\d{4}-\d{4,7}|GHSA-[0-9A-Za-z]{4}-[0-9A-Za-z]{4}-[0-9A-Za-z]{4})"
    for m in re.findall(pat, (f.get("title") or "") + " " + (f.get("description") or ""),
                        re.IGNORECASE):
        if m.upper() not in ids:
            ids.append(m.upper())
    return ids


def dedupe_mark(findings):
    """Marque les doublons (ex. secret Cloudinary remonté par 2 scanners).
    Conserve TOUS les findings — le doublon est signalé, jamais supprimé."""
    seen = {}
    for f in findings:
        # Clé heuristique : titre normalisé + chemin (les secrets dupliqués
        # partagent titre/fichier même si l'id de scanner diffère).
        key = ((f.get("title") or "").strip().lower(),
               (f.get("file_path") or "").strip().lower())
        f["is_duplicate"] = False
        f["duplicate_of"] = None
        if key in seen:
            f["is_duplicate"] = True
            f["duplicate_of"] = seen[key]
        else:
            seen[key] = f.get("id")
    n_dup = sum(1 for f in findings if f["is_duplicate"])
    if n_dup:
        print(f"[dedupe] {n_dup} doublon(s) signalé(s) (conservés, tagués).")
    return findings


# ---------------------------------------------------------------------------
# TÂCHE B — Enrichissement EPSS + CISA KEV
# ---------------------------------------------------------------------------

def fetch_kev(cfg):
    """Charge le catalogue CISA KEV UNE FOIS (cache disque + TTL).
    Renvoie (set_de_cveID, {cveID: ransomware_bool}). Échec réseau -> (set(), {})."""
    # Cache disque
    try:
        st = os.stat(KEV_CACHE_PATH)
        if (time.time() - st.st_mtime) < KEV_CACHE_TTL:
            with open(KEV_CACHE_PATH, "r", encoding="utf-8") as fh:
                cat = json.load(fh)
            kev_ids = set(cat.get("_ids", []))
            ransom = cat.get("_ransom", {})
            if kev_ids:
                print(f"[kev] {len(kev_ids)} CVE chargées depuis le cache disque.")
                return kev_ids, ransom
    except (OSError, json.JSONDecodeError):
        pass   # cache absent/corrompu -> re-fetch

    try:
        code, cat = _http("GET", KEV_URL, timeout=30)
        if code >= 400 or not isinstance(cat, dict):
            raise RuntimeError(f"KEV {code}")
    except RuntimeError as e:
        print(f"[kev] AVERTISSEMENT : KEV indisponible, on continue sans -> {e}")
        return set(), {}

    kev_ids, ransom = set(), {}
    for v in cat.get("vulnerabilities", []):
        cid = v.get("cveID")
        if cid:
            kev_ids.add(cid)
            ransom[cid] = (v.get("knownRansomwareCampaignUse", "Unknown") == "Known")
    print(f"[kev] {len(kev_ids)} CVE connues exploitées chargées "
          f"(catalogue {cat.get('catalogVersion', '?')}).")
    try:
        with open(KEV_CACHE_PATH, "w", encoding="utf-8") as fh:
            json.dump({"_ids": sorted(kev_ids), "_ransom": ransom}, fh)
    except OSError:
        pass
    return kev_ids, ransom


def fetch_epss(cves, timeout=15):
    """Recherche EPSS par lots (un seul param cve= séparé par des virgules).
    Renvoie {cve: {'epss': float, 'percentile': float}}. CVE inconnue -> absente."""
    cves = [c for c in dict.fromkeys(cves) if c and c.upper().startswith("CVE-")]
    if not cves:
        return {}
    out = {}
    for i in range(0, len(cves), 80):     # découpage prudent
        chunk = cves[i:i + 80]
        url = f"{EPSS_URL}?cve={','.join(chunk)}"
        try:
            code, payload = _http("GET", url, timeout=timeout)
            if code >= 400 or not isinstance(payload, dict):
                continue
        except RuntimeError as e:
            print(f"[epss] AVERTISSEMENT : lot ignoré (réseau) -> {e}")
            continue
        for row in payload.get("data", []):
            try:
                out[row["cve"]] = {
                    "epss": float(row.get("epss", 0.0) or 0.0),
                    "percentile": float(row.get("percentile", 0.0) or 0.0),
                }
            except (TypeError, ValueError, KeyError):
                continue
    print(f"[epss] scores EPSS obtenus pour {len(out)} CVE.")
    return out


def enrich(f, epss_map, kev_ids, ransom):
    """Attache l'enrichissement à UN finding. Agrégation pire-cas (max EPSS, any KEV).
    Aucun CVE -> zéros/False (secrets/SAST/Dockerfile)."""
    cves = extract_cves(f)
    f["cves"] = cves
    f["cve"] = cves[0] if cves else None
    if not cves:
        f["epss_score"] = None
        f["kev"] = False
        f["ransomware"] = False
        return f
    f["epss_score"] = max((epss_map.get(c, {}).get("epss", 0.0) for c in cves), default=0.0)
    f["kev"] = any(c in kev_ids for c in cves)
    f["ransomware"] = any(ransom.get(c, False) for c in cves)
    return f


# ---------------------------------------------------------------------------
# TÂCHE C — Triage Ollama qwen2.5:7b (format:json, temperature 0)
# ---------------------------------------------------------------------------

SYSTEM_PROMPT = """You are a security triage assistant for a DevSecOps pipeline.
You receive ONE scanner finding and output a triage verdict.

Respond with ONLY a single JSON object, no prose, no markdown, matching EXACTLY:
{
  "is_false_positive": <true|false>,
  "fp_reason": "<short reason; empty string if not a false positive>",
  "risk_priority": "<one of: P1, P2, P3, P4>",
  "priority_score": <integer 0-100>,
  "remediation": "<one concise actionable sentence>"
}

RULES (apply in order):
1. FALSE POSITIVES — is_false_positive=true when the match is clearly not a real exploitable secret/vuln:
   - Placeholder/fake/example secrets: values containing FAKE, EXAMPLE, PLACEHOLDER, XXXX, DUMMY, SAMPLE, CHANGEME (e.g. a Stripe key "sk_test_...FAKE").
   - Test-only/example/fixture files or documented sample config.
   When is_false_positive=true: risk_priority="P4", priority_score<=10, give the reason in fp_reason.
2. KNOWN-EXPLOITED / HIGH EPSS — if kev=true OR epss>=0.5, set risk_priority="P1" and priority_score>=85 (unless rule 1 applied).
3. OTHERWISE score by severity + exploitability:
   - Critical/High with a CVE -> P1/P2, score 70-95.
   - Medium -> P3, score 40-69.
   - Low/Info -> P4, score 1-39.
   Nudge score up with higher epss.
4. remediation: one specific action (upgrade <component> to a fixed version, rotate+revoke the secret into a secret manager, add input validation, pin the base image, etc.).

priority_score must be consistent with risk_priority (P1 highest ... P4 lowest).

EXAMPLE INPUT:
scanner=Gitleaks | title=Stripe API key | severity=High | component=server/.env | file=server/.env | match=sk_test_51FAKE0000FAKE | cve=none | epss=none | kev=false
EXAMPLE OUTPUT:
{"is_false_positive": true, "fp_reason": "Stripe key is a placeholder containing 'FAKE', not a live secret", "risk_priority": "P4", "priority_score": 5, "remediation": "Remove the placeholder from VCS and load real keys from a secret manager at runtime"}"""

VALID_PRIORITIES = {"P1", "P2", "P3", "P4"}
PLACEHOLDER_TOKENS = ("FAKE", "EXAMPLE", "PLACEHOLDER", "DUMMY", "XXXX",
                      "CHANGEME", "YOUR_", "TEST_KEY", "SAMPLE")

# Pré-filtre déterministe des secrets factices. Étroit (exige un indice "secret"
# dans le titre) pour ne PAS toucher les advisories SCA (ex. le mot "example"
# présent dans un texte d'avis Nodemailer).
SECRET_TITLE_HINTS = ("secret", "api key", "api-key", "token", "credential",
                      "password", "hard coded", "hard-coded", "private key")
STRONG_PLACEHOLDER = ("FAKE", "PLACEHOLDER", "CHANGEME", "CHANGE_ME", "DUMMY",
                      "XXXX", "YOUR_", "SK_TEST_", "TEST_KEY", "REPLACE_", "EXAMPLE_KEY")


def is_placeholder_secret(f):
    """Vrai si le finding RESSEMBLE à un secret ET contient un marqueur factice.
    Garantit que les placeholders (sk_test_…FAKE, etc.) soient TOUJOURS classés
    faux positifs, indépendamment du non-déterminisme du LLM 7B (cohérence run-à-run).
    N'impacte pas les CVE/GHSA (le titre ne contient pas d'indice 'secret')."""
    title = (f.get("title") or "").lower()
    if not any(h in title for h in SECRET_TITLE_HINTS):
        return False
    blob = ((f.get("title") or "") + " " + (f.get("description") or "")).upper()
    return any(tok in blob for tok in STRONG_PLACEHOLDER)


def _guess_scanner(f):
    """Devine le scanner d'origine pour le prompt (tags / test type)."""
    tags = " ".join(f.get("tags", []) or []).lower()
    rel = (((f.get("related_fields") or {}).get("test") or {}).get("test_type_name")
           or "") if isinstance(f.get("related_fields"), dict) else ""
    blob = (tags + " " + rel).lower()
    for s in ("gitleaks", "semgrep", "trivy", "hadolint", "checkov"):
        if s in blob:
            return s
    return "scanner"


def build_user_msg(f):
    """Construit le message utilisateur (une ligne compacte key=value)."""
    def g(k, default="none"):
        v = f.get(k)
        return default if v in (None, "", []) else v

    # Le snippet de secret est tronqué : ne jamais réinjecter une vraie clé entière.
    snippet = (f.get("description") or "")[:120].replace("\n", " ")

    epss = f.get("epss_score")
    epss_s = f"{epss:.4f}" if isinstance(epss, (int, float)) else "none"
    # CORRECTIF VÉRIFIÉ : la CVE vient de l'enrichissement (f['cve']), JAMAIS de f.get('cve') API.
    cve_s = f.get("cve") or "none"

    return (
        f"scanner={_guess_scanner(f)} | "
        f"title={g('title')} | "
        f"severity={g('severity')} | "
        f"component={g('component_name')}@{g('component_version', '')} | "
        f"file={g('file_path')} | "
        f"match={snippet or 'none'} | "
        f"cve={cve_s} | "
        f"epss={epss_s} | "
        f"kev={'true' if f.get('kev') else 'false'}"
    )


def _ollama_chat(cfg, system_msg, user_msg, timeout=120):
    """Un POST sur /api/chat. Renvoie la chaîne JSON émise par le modèle."""
    payload = {
        "model": cfg["OLLAMA_MODEL"],
        "messages": [
            {"role": "system", "content": system_msg},
            {"role": "user", "content": user_msg},
        ],
        "stream": False,
        "format": "json",
        "options": {"temperature": 0, "num_predict": 400, "num_ctx": 4096},
    }
    code, env = _http("POST", f"{cfg['OLLAMA_URL']}/api/chat",
                      payload=payload, timeout=timeout, retries=1)
    if code >= 400 or not isinstance(env, dict):
        raise RuntimeError(f"Ollama {code}: {env}")
    # /api/chat : le verdict est une CHAÎNE dans message.content (à json.loads soi-même).
    return env["message"]["content"]


def _coerce_verdict(raw):
    """Valide + normalise le dict du modèle au schéma strict. Lève si invalide."""
    if not isinstance(raw, dict):
        raise ValueError("sortie modèle non-JSON-objet")

    is_fp = raw.get("is_false_positive")
    if isinstance(is_fp, str):
        is_fp = is_fp.strip().lower() in ("true", "yes", "1")
    is_fp = bool(is_fp)

    prio = str(raw.get("risk_priority", "")).upper().strip()
    if prio not in VALID_PRIORITIES:
        raise ValueError(f"risk_priority invalide : {prio!r}")

    try:
        score = int(round(float(raw.get("priority_score", -1))))
    except (TypeError, ValueError):
        raise ValueError("priority_score invalide")
    score = max(0, min(100, score))

    return {
        "is_false_positive": is_fp,
        "reason": str(raw.get("fp_reason", "") or ""),
        "priority": prio,
        "priority_score": score,
        "remediation": (str(raw.get("remediation", "") or "").strip()
                        or "Examiner le finding et appliquer le correctif recommandé."),
        "_source": "llm",
    }


def _rule_based_verdict(f, note=""):
    """Repli déterministe (miroir du prompt). Renvoie toujours un verdict valide."""
    sev = (f.get("severity") or "").lower()
    snip = (f.get("description") or "").upper()
    fpath = (f.get("file_path") or "").lower()
    epss = f.get("epss_score") if isinstance(f.get("epss_score"), (int, float)) else 0.0
    kev = bool(f.get("kev"))

    is_fp = (any(tok in snip for tok in PLACEHOLDER_TOKENS)
             or "sk_test_" in (f.get("description") or "").lower()
             or any(p in fpath for p in ("/test", "test/", "example", "fixture", ".sample")))
    if is_fp:
        return {"is_false_positive": True,
                "reason": "Motif placeholder/test détecté (repli déterministe).",
                "priority": "P4", "priority_score": 5,
                "remediation": "Confirmer le placeholder ; retirer du VCS et utiliser un gestionnaire de secrets.",
                "_source": "fallback", "_note": note}

    if kev or epss >= 0.5:
        return {"is_false_positive": False, "reason": "",
                "priority": "P1", "priority_score": 90 if kev else 85,
                "remediation": f"Corriger {f.get('component_name', 'le composant')} sans délai (KEV/EPSS élevé).",
                "_source": "fallback", "_note": note}

    sev_map = {"critical": ("P1", 88), "high": ("P2", 75), "medium": ("P3", 55),
               "low": ("P4", 30), "info": ("P4", 15), "informational": ("P4", 15)}
    prio, score = sev_map.get(sev, ("P3", 50))
    score = min(100, score + int(epss * 10))
    return {"is_false_positive": False, "reason": "",
            "priority": prio, "priority_score": score,
            "remediation": f"Traiter selon la sévérité ({sev or 'inconnue'}) ; mettre à jour le composant concerné.",
            "_source": "fallback", "_note": note}


def triage(cfg, f, use_llm=True):
    """Verdict validé pour UN finding. Ne lève jamais.
    Hybride : repli déterministe direct si use_llm=False (findings CVE)."""
    if not use_llm:
        v = _rule_based_verdict(f, note="scoring déterministe (CVE EPSS/KEV)")
        v["_source"] = "deterministic"
        return v

    user_msg = build_user_msg(f)
    last_err = None
    for attempt in (1, 2):
        sys_msg = SYSTEM_PROMPT
        if attempt == 2:
            sys_msg += ("\n\nIMPORTANT: Your previous reply was invalid. Output ONLY the "
                        "JSON object with EXACTLY these keys and risk_priority in "
                        "{P1,P2,P3,P4}. No extra text.")
        try:
            content = _ollama_chat(cfg, sys_msg, user_msg)
            try:
                parsed = json.loads(content)
            except json.JSONDecodeError:
                m = re.search(r"\{.*\}", content, re.DOTALL)
                if not m:
                    raise
                parsed = json.loads(m.group(0))
            return _coerce_verdict(parsed)
        except (RuntimeError, urllib.error.URLError, TimeoutError, ValueError,
                json.JSONDecodeError, KeyError) as e:
            last_err = e
            continue
    return _rule_based_verdict(f, note=f"LLM en échec ({last_err}) ; repli déterministe")


def score(f):
    """Score 0-100 final combinant verdict + EPSS + KEV (cohérent avec la priorité)."""
    v = f["verdict"]
    s = v["priority_score"]
    if f.get("kev"):
        s = max(s, 90)
    epss = f.get("epss_score")
    if isinstance(epss, (int, float)):
        s = min(100, s + int(epss * 10))
    return max(0, min(100, s))


# ---------------------------------------------------------------------------
# TÂCHE D — Réécriture DefectDojo (additive, non destructive, idempotente)
# ---------------------------------------------------------------------------

def _finding_has_ai_note(cfg, fid):
    """Vrai si une note [AI-TRIAGE] existe déjà (idempotence sans DELETE)."""
    try:
        code, data = _http("GET", f"{cfg['DD_URL']}/api/v2/findings/{fid}/notes/",
                           headers=_dd_headers(cfg), timeout=20)
        items = data if isinstance(data, list) else (data.get("results", []) if isinstance(data, dict) else [])
        return any((n.get("entry") or "").startswith(AI_NOTE_SENTINEL) for n in items)
    except RuntimeError:
        return False


def build_ai_note(f, v):
    """Bloc d'audit compact poussé dans les notes du finding."""
    lines = [
        AI_NOTE_SENTINEL,
        f"Verdict : {'FAUX POSITIF' if v['is_false_positive'] else 'CONFIRMÉ'}",
        f"Priorité : {v['priority']}  (score {f['priority_score']}/100)",
        f"Raison : {v['reason'] or 'n/a'}",
    ]
    if f.get("cve"):
        epss = f.get("epss_score")
        epss_s = f"{epss:.1%}" if isinstance(epss, (int, float)) else "n/a"
        lines.append(f"CVE : {f['cve']}  EPSS={epss_s}  "
                     f"KEV={'OUI (exploité)' if f.get('kev') else 'non'}"
                     f"{'  RANSOMWARE' if f.get('ransomware') else ''}")
    if f.get("is_duplicate"):
        lines.append(f"Note : doublon du finding #{f.get('duplicate_of')} "
                     f"(même secret/composant remonté par un autre scanner).")
    lines.append(f"Remédiation : {v['remediation']}")
    lines.append(f"Source verdict : {v.get('_source', 'llm')}")
    lines.append(f"-- qwen2.5:7b @ {time.strftime('%Y-%m-%d %H:%M:%S')}")
    return "\n".join(lines)


def desired_tags(f, v):
    tags = {"ai-triaged", f"ai-{v['priority'].lower()}"}
    if v["is_false_positive"]:
        tags.add("ai-false-positive")
    if f.get("kev"):
        tags.add("kev-known-exploited")
    if f.get("is_duplicate"):
        tags.add("ai-duplicate")
    return tags


def write_back(cfg, f, dry_run=True):
    """Réécriture additive/idempotente pour UN finding. Renvoie un libellé d'action."""
    fid = f["id"]
    v = f["verdict"]

    # Garde-fou : ne JAMAIS auto-supprimer un CVE connu exploité (KEV), même si le LLM dit FP.
    mark_fp = bool(v["is_false_positive"]) and not f.get("kev")

    existing = set(f.get("tags", []) or [])
    new_tags = sorted(existing | desired_tags(f, v))

    if dry_run:
        return (f"DRY-RUN id={fid} false_p={mark_fp} "
                f"P={v['priority']} tags={sorted(desired_tags(f, v))}")

    # 1) PATCH partiel : false_p + tags (PATCH ne touche AUCUN autre champ -> pas de perte).
    #    active = not mark_fp -> un re-run RÉACTIVE un finding faussement désactivé.
    #    verified = not mark_fp : DefectDojo REFUSE un faux positif "verified=true"
    #    ("False positive findings cannot be verified") -> un FP doit être NON vérifié.
    patch = {"tags": new_tags, "false_p": mark_fp,
             "active": (not mark_fp), "verified": (not mark_fp)}
    code, resp = _http("PATCH", f"{cfg['DD_URL']}/api/v2/findings/{fid}/",
                       headers=_dd_headers(cfg), payload=patch, timeout=30)
    if code >= 400:   # plus d'échec silencieux : on remonte l'erreur API
        print(f"\n[write] ⚠️ PATCH finding {fid} échoué ({code}): {str(resp)[:160]}")
        return f"FAIL id={fid} ({code})"

    # 2) Note d'audit via le sous-endpoint /notes/ (notes en lecture seule sur le finding).
    #    Idempotence : on ne POSTe que s'il n'y a pas déjà une note [AI-TRIAGE]
    #    (pas de DELETE /notes/{id}/ — cet endpoint n'existe pas dans DefectDojo).
    if not _finding_has_ai_note(cfg, fid):
        _http("POST", f"{cfg['DD_URL']}/api/v2/findings/{fid}/notes/",
              headers=_dd_headers(cfg),
              payload={"entry": build_ai_note(f, v), "private": False}, timeout=30)

    time.sleep(0.2)   # courtoisie : une seule VM sert DefectDojo + Ollama + Docker
    return f"WROTE id={fid} false_p={mark_fp} P={v['priority']}"


# ---------------------------------------------------------------------------
# Rapport Markdown + résumé console
# ---------------------------------------------------------------------------

def _trunc(s, n):
    s = (s or "").replace("\n", " ").replace("|", "/")
    return s if len(s) <= n else s[: n - 1] + "…"


def _metrics(findings):
    total = len(findings)
    fps = [f for f in findings if f["verdict"]["is_false_positive"]]
    dups = [f for f in findings if f.get("is_duplicate")]
    real = [f for f in findings if not f["verdict"]["is_false_positive"]]
    kev = [f for f in real if f.get("kev")]
    by_p = {p: sum(1 for f in real if f["verdict"]["priority"] == p)
            for p in ("P1", "P2", "P3", "P4")}
    return {"total": total, "real": len(real), "fp": len(fps), "dup": len(dups),
            "kev": len(kev), "by_p": by_p, "real_list": real, "fp_list": fps}


def build_report(findings, top_n=15):
    m = _metrics(findings)
    real_sorted = sorted(m["real_list"], key=lambda f: f["priority_score"], reverse=True)
    out = []
    out.append("# Rapport de triage IA — flint_commerce (engagement CI/CD Pipeline)\n")
    out.append(f"_Généré le {time.strftime('%Y-%m-%d %H:%M')} "
               f"par qwen2.5:7b via l'API DefectDojo_\n")

    out.append("## Synthèse\n")
    out.append(
        f"**{m['total']} findings → {m['real']} priorités réelles, "
        f"{m['fp']} faux positifs auto-filtrés "
        f"(dont le placeholder Stripe `sk_test_…FAKE`), "
        f"{m['dup']} doublons collapsés.**\n")
    out.append("| Catégorie | Nombre |")
    out.append("|---|---|")
    out.append(f"| Findings actifs (total) | {m['total']} |")
    out.append(f"| Priorités réelles | {m['real']} |")
    out.append(f"| → P1 / P2 / P3 / P4 | "
               f"{m['by_p']['P1']} / {m['by_p']['P2']} / {m['by_p']['P3']} / {m['by_p']['P4']} |")
    out.append(f"| Connus exploités (CISA KEV) | {m['kev']} |")
    out.append(f"| Faux positifs filtrés | {m['fp']} |")
    out.append(f"| Doublons signalés | {m['dup']} |\n")

    out.append(f"## Top {min(top_n, len(real_sorted))} priorités\n")
    out.append("| # | Pri | Score | Sévérité | Titre | CVE | EPSS | KEV | Composant |")
    out.append("|---|---|---|---|---|---|---|---|---|")
    for i, f in enumerate(real_sorted[:top_n], 1):
        epss = f.get("epss_score")
        epss_s = f"{epss:.0%}" if isinstance(epss, (int, float)) else "—"
        out.append(
            f"| {i} | {f['verdict']['priority']} | {f['priority_score']} "
            f"| {f.get('severity', '')} | {_trunc(f.get('title'), 48)} "
            f"| {f.get('cve') or '—'} | {epss_s} "
            f"| {'KEV' if f.get('kev') else ''} "
            f"| {_trunc(f.get('component_name') or '', 24)} |")
    out.append("")

    out.append("## Faux positifs auto-filtrés\n")
    out.append("| Titre | Raison |")
    out.append("|---|---|")
    for f in m["fp_list"]:
        out.append(f"| {_trunc(f.get('title'), 48)} | {_trunc(f['verdict']['reason'], 80)} |")
    out.append("")

    out.append("## Remédiation (top items)\n")
    for i, f in enumerate(real_sorted[:top_n], 1):
        out.append(f"{i}. **{_trunc(f.get('title'), 60)}** "
                   f"({f['verdict']['priority']}) — {f['verdict']['remediation']}")
    out.append("")
    return "\n".join(out)


def print_console_summary(findings, report_path, dry_run):
    m = _metrics(findings)
    bar = "=" * 64
    mode = "  (DRY-RUN — aucune réécriture)" if dry_run else ""
    print(f"\n{bar}\n  TRIAGE IA TERMINÉ{mode}\n{bar}")
    print(f"  {m['total']} findings  ->  {m['real']} priorités réelles, "
          f"{m['fp']} faux positifs filtrés, {m['dup']} doublons")
    print(f"  P1={m['by_p']['P1']}  P2={m['by_p']['P2']}  "
          f"P3={m['by_p']['P3']}  P4={m['by_p']['P4']}   "
          f"KEV(exploités)={m['kev']}")
    if m["fp"]:
        names = ", ".join(_trunc(f.get("title"), 30) for f in m["fp_list"][:3])
        print(f"  Exemples FP : {names}")
    print(f"  Rapport écrit : {report_path}")
    print(bar)


def notify_slack(cfg, findings, report_path, dry_run=False):
    """Poste un résumé priorisé du triage dans Slack (webhook entrant).
    Sans SLACK_WEBHOOK_URL -> on saute proprement (le triage n'échoue JAMAIS pour Slack)."""
    url = cfg.get("SLACK_WEBHOOK_URL", "")
    if not url:
        print("[slack] SLACK_WEBHOOK_URL non défini -> notification ignorée.")
        return
    m = _metrics(findings)
    real_sorted = sorted(m["real_list"], key=lambda f: f["priority_score"], reverse=True)
    top = [f for f in real_sorted if f["verdict"]["priority"] in ("P1", "P2")][:5]
    top_lines = "\n".join(
        f"• *{f['verdict']['priority']}* ({f['priority_score']}/100) {_trunc(f.get('title'), 70)}"
        for f in top) or "_aucune urgence P1/P2_"
    tag = "  _(dry-run)_" if dry_run else ""
    summary = (
        f"*{m['total']} findings* → *{m['real']} priorités réelles*, "
        f"*{m['fp']} faux positifs filtrés*, {m['dup']} doublons{tag}\n"
        f"Priorités : 🔴 P1={m['by_p']['P1']}  🟠 P2={m['by_p']['P2']}  "
        f"🟡 P3={m['by_p']['P3']}  ⚪ P4={m['by_p']['P4']}  ·  KEV={m['kev']}")
    payload = {
        "text": f"Triage IA flint_commerce : {m['real']} priorités, {m['fp']} FP filtrés",
        "blocks": [
            {"type": "header",
             "text": {"type": "plain_text", "text": "🛡️ Triage IA — flint_commerce", "emoji": True}},
            {"type": "section", "text": {"type": "mrkdwn", "text": summary}},
            {"type": "section", "text": {"type": "mrkdwn", "text": f"*Top urgences :*\n{top_lines}"}},
            {"type": "context", "elements": [
                {"type": "mrkdwn",
                 "text": f"qwen2.5:7b · {time.strftime('%Y-%m-%d %H:%M')} · rapport `{report_path}`"}]},
        ],
    }
    try:
        code, resp = _http("POST", url, payload=payload, timeout=20, retries=2)
        if code >= 400:
            print(f"[slack] ⚠️ webhook a répondu {code}: {str(resp)[:160]}")
        else:
            print(f"[slack] ✅ résumé posté ({m['real']} priorités, {m['fp']} FP filtrés).")
    except RuntimeError as e:
        print(f"[slack] ⚠️ envoi échoué (le triage reste OK) -> {e}")


# ---------------------------------------------------------------------------
# CLI + orchestration v1.0
# ---------------------------------------------------------------------------

def parse_args():
    p = argparse.ArgumentParser(description="Agent de triage IA DevSecOps pour DefectDojo")
    g = p.add_mutually_exclusive_group()
    g.add_argument("--dry-run", action="store_true",
                   help="Pipeline complet + rapport mais AUCUNE réécriture (DÉFAUT).")
    g.add_argument("--write", action="store_true",
                   help="Active la réécriture DefectDojo (false_p + note).")
    p.add_argument("--limit", type=int, default=0,
                   help="Limite le nombre de findings traités (0 = tous). Pratique pour une démo.")
    p.add_argument("--llm-all", action="store_true",
                   help="Passe TOUS les findings au LLM (sinon CVE = scoring déterministe).")
    p.add_argument("--report-path", default="ai_triage_report.md")
    p.add_argument("--top-n", type=int, default=15)
    return p.parse_args()


def main():
    args = parse_args()
    dry_run = not args.write          # lecture seule par défaut (sécurité du livrable noté)
    cfg = load_config()
    print(f"Config : DD={cfg['DD_URL']}  modèle={cfg['OLLAMA_MODEL']}  "
          f"{'[DRY-RUN]' if dry_run else '[ÉCRITURE ACTIVE]'}")

    preflight(cfg)

    kev_ids, ransom = fetch_kev(cfg)
    findings = fetch_findings(cfg)
    findings = dedupe_mark(findings)
    if args.limit:
        findings = findings[: args.limit]

    # Un seul aller-retour EPSS pour toutes les CVE du run.
    all_cves = sorted({c for f in findings for c in extract_cves(f)})
    epss_map = fetch_epss(all_cves)
    for f in findings:
        enrich(f, epss_map, kev_ids, ransom)

    n = len(findings)
    print(f"\nTriage de {n} findings (CPU-only, soyez patient)…")
    t0 = time.time()
    for i, f in enumerate(findings, 1):
        # Hybride : findings AVEC CVE -> scoring déterministe EPSS/KEV (rapide) ;
        # findings SANS CVE (secrets/SAST/IaC) -> jugement LLM (où vit la détection FP).
        use_llm = args.llm_all or not f.get("cves")
        f["verdict"] = triage(cfg, f, use_llm=use_llm)
        # Garde-fou cohérent : un finding portant une CVE n'est JAMAIS un faux positif
        # (vraie vuln de dépendance) -> empêche le LLM 7B de masquer une vraie CVE.
        if f.get("cves") and f["verdict"]["is_false_positive"]:
            f["verdict"]["is_false_positive"] = False
            f["verdict"]["reason"] = ""
        # Pré-filtre déterministe (règles + IA) : un secret factice (FAKE, sk_test_…,
        # PLACEHOLDER) est TOUJOURS un faux positif -> cohérence run-à-run, corrige le
        # non-déterminisme du LLM. N'affecte pas les CVE/GHSA (protégés au-dessus).
        if not f.get("cves") and is_placeholder_secret(f):
            f["verdict"]["is_false_positive"] = True
            f["verdict"]["reason"] = "Marqueur placeholder/factice détecté (pré-filtre déterministe)."
            f["verdict"]["priority"] = "P4"
            f["verdict"]["priority_score"] = 5
        f["priority_score"] = score(f)
        eta = (time.time() - t0) / i * (n - i)
        sys.stdout.write(
            f"\r[{i}/{n}] {f['verdict']['priority']} "
            f"score={f['priority_score']:>3} src={f['verdict'].get('_source','?'):<11} "
            f"ETA~{int(eta)}s   ")
        sys.stdout.flush()
    print()

    wrote = 0
    for f in findings:
        label = write_back(cfg, f, dry_run=dry_run)
        if label.startswith("WROTE"):
            wrote += 1
    print(f"{'(dry-run) aurait écrit' if dry_run else 'Écrit'} : "
          f"{n if dry_run else wrote} findings.")

    report = build_report(findings, top_n=args.top_n)
    with open(args.report_path, "w", encoding="utf-8") as fh:
        fh.write(report)
    print_console_summary(findings, args.report_path, dry_run)
    notify_slack(cfg, findings, args.report_path, dry_run=dry_run)
    return 0


if __name__ == "__main__":
    import urllib.parse   # utilisé par fetch_findings (quote) m
    try:
        sys.exit(main())
    except KeyboardInterrupt:
        sys.exit("\nInterrompu.")
