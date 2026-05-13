# Stufe 1: Abhängigkeiten
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# Stufe 2: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Stufe 3: Runner (Produktion)
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV production

# Sicherheits-Tipp: Nicht als Root-User ausführen
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Kopiere nur die notwendigen Dateien aus dem Build-Schritt
COPY --from=builder ./public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
