# ==================== STAGE 1: BUILD ====================
FROM node:22-alpine AS builder

WORKDIR /app

# Copier les fichiers de dépendances
COPY package.json package-lock.json* ./

# Installer les dépendances en ignorant les scripts (pour éviter l'erreur husky)
RUN npm ci --legacy-peer-deps --ignore-scripts

# Installer NestJS CLI globalement (nécessaire pour build)
RUN npm install -g @nestjs/cli

# Copier le code source
COPY . .

# Builder l'application
RUN npm run build

# ==================== STAGE 2: PRODUCTION ====================
FROM node:22-alpine

ENV NODE_ENV=production
WORKDIR /app

# Copier uniquement le build et les dépendances de production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package.json ./

EXPOSE 3000

CMD ["node", "dist/main"]