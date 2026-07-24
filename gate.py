#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
gate.py — Gate de sécurité INTELLIGENTE pour le pipeline DevSecOps.

Fait ÉCHOUER le pipeline s'il reste des findings priorisés **P1** par l'agent IA
(tag `ai-p1`) qui sont actifs, NON faux-positifs et NON risk-accepted dans DefectDojo.

Différence avec une gate "CVSS brut" : on bloque sur la priorité RÉELLE calculée par
l'IA (sévérité + EPSS + CISA KEV + filtrage des faux positifs) — pas sur un score
théorique. Un faux positif (placeholder Stripe) ne bloque donc PAS le pipeline.

Pour débloquer : corriger la vulnérabilité, OU la marquer "risk accepted" dans
DefectDojo (flux de gouvernance classique).

100% bibliothèque standard (urllib) — aucun pip.

Variables d'environnement :
    DD_URL          (def http://localhost:8080)
    DD_API_TOKEN    (obligatoire)
    DD_PRODUCT      (def flint_commerce)
    GATE_TAG        (def ai-p1)        -> le tag qui bloque
    GATE_MAX        (def 0)            -> nombre de P1 toléré avant blocage
"""
import json
import os
import sys
import urllib.error
import urllib.parse
import urllib.request

DD_URL = os.environ.get("DD_URL", "http://localhost:8080").rstrip("/")
TOKEN = os.environ.get("DD_API_TOKEN", "")
PRODUCT = os.environ.get("DD_PRODUCT", "flint_commerce")
GATE_TAG = os.environ.get("GATE_TAG", "ai-p1")
GATE_MAX = int(os.environ.get("GATE_MAX", "0"))

if not TOKEN:
    sys.exit("FATAL : la variable DD_API_TOKEN est obligatoire.")


def fetch_blockers():
    """Récupère les findings actifs / non-FP / non-risk-accepted portant GATE_TAG.
    Filtrage du tag côté client (robuste quelle que soit la syntaxe du filtre serveur)."""
    url = (f"{DD_URL}/api/v2/findings/"
           f"?product_name={urllib.parse.quote(PRODUCT)}"
           f"&active=true&false_p=false&risk_accepted=false&limit=100")
    blockers = []
    while url:
        req = urllib.request.Request(
            url, headers={"Authorization": f"Token {TOKEN}", "Accept": "application/json"})
        try:
            with urllib.request.urlopen(req, timeout=30) as r:
                data = json.loads(r.read().decode("utf-8"))
        except urllib.error.URLError as e:
            sys.exit(f"FATAL : DefectDojo injoignable ({DD_URL}) -> {e}")
        for f in data.get("results", []):
            if GATE_TAG in (f.get("tags") or []):
                blockers.append(f)
        url = data.get("next")
    return blockers


def main():
    blockers = fetch_blockers()
    n = len(blockers)
    print(f"🚦 Gate sécurité — produit '{PRODUCT}', tag bloquant '{GATE_TAG}', seuil={GATE_MAX}")
    print(f"   {n} finding(s) {GATE_TAG} actif(s) / non-FP / non-risk-accepted :")
    for f in sorted(blockers, key=lambda x: x.get("severity", ""))[:20]:
        print(f"     • [{f.get('severity', '?'):<8}] {(f.get('title') or '')[:80]}")

    if n > GATE_MAX:
        print(f"\n❌ GATE ÉCHOUÉE : {n} priorité(s) P1 non traitée(s) (seuil autorisé = {GATE_MAX}).")
        print("   → Corriger la vulnérabilité, ou la marquer 'Risk Accepted' dans DefectDojo.")
        return 1
    print(f"\n✅ GATE OK : {n} P1 ≤ seuil {GATE_MAX}. Le pipeline peut continuer.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
