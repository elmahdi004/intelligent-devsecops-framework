# =====================================================================
#  flint_commerce — SERVER (API Express)  —  image Docker DURCIE
#  Multi-stage : 1) install deps (compile bcrypt)  2) runtime minimal non-root
# =====================================================================

# ---------- Stage 1 : dépendances ----------
FROM node:20-alpine AS deps
WORKDIR /app
# Outils de build pour les modules natifs (bcrypt) — restent dans CE stage uniquement
RUN apk add --no-cache python3 make g++
COPY package.json package-lock.json ./
# Installation reproductible des dépendances de PRODUCTION uniquement
RUN npm ci --omit=dev && npm cache clean --force

# ---------- Stage 2 : runtime ----------
FROM node:20-alpine AS runtime
ENV NODE_ENV=production
WORKDIR /app

# On récupère uniquement les node_modules de prod déjà installés
COPY --from=deps /app/node_modules ./node_modules
# Code applicatif (le .dockerignore exclut .env, node_modules, .git …)
COPY . .

# Durcissement : exécution avec l'utilisateur NON-root 'node' fourni par l'image
USER node

EXPOSE 5000
CMD ["node", "index.js"]
