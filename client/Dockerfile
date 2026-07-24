# =====================================================================
#  flint_commerce — CLIENT (React + Vite)  —  image Docker DURCIE
#  Multi-stage : 1) build Vite  2) service via nginx NON-root
# =====================================================================

# ---------- Stage 1 : build de l'app Vite ----------
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# Génère les fichiers statiques optimisés dans /app/dist
RUN npm run build

# ---------- Stage 2 : service statique via nginx non-root ----------
FROM nginxinc/nginx-unprivileged:1.27-alpine AS runtime
# Cette image tourne déjà en NON-root (user 'nginx', UID 101) et écoute sur 8080
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 8080
