# Image de production : Next.js 16 + Prisma 7 (migrations appliquées au démarrage)
FROM node:22-slim AS base
ENV PNPM_HOME=/pnpm PATH=/pnpm:$PATH NEXT_TELEMETRY_DISABLED=1
RUN corepack enable && apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates && rm -rf /var/lib/apt/lists/*
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

FROM deps AS build
COPY . .
# Valeurs factices, valables pour cette étape de build seulement (l'image finale n'en hérite pas) :
# le code d'authentification lit ces variables dès qu'il est chargé, donc le build en a besoin.
# Les vraies valeurs sont fournies au démarrage par docker-compose.prod.yml.
ENV DATABASE_URL=postgresql://build:build@localhost:5432/build \
    BETTER_AUTH_SECRET=valeur-factice-pour-le-build-uniquement \
    BETTER_AUTH_URL=http://localhost:3000
RUN pnpm prisma generate && pnpm build

FROM base AS run
ENV NODE_ENV=production PORT=3000 HOSTNAME=0.0.0.0
COPY --from=build /app /app
EXPOSE 3000
# Prépare la base (migrations, ou création du schéma au tout premier lancement), puis démarre.
CMD ["sh", "scripts/docker-start.sh"]
