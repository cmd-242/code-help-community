#!/bin/sh
# Démarrage en production : prépare la base, puis lance l'application.
set -e

if [ -n "$(ls -d prisma/migrations/*/ 2>/dev/null)" ]; then
  echo "[chc] Application des migrations Prisma…"
  pnpm prisma migrate deploy
else
  # Première mise en ligne sans migration commitée : on crée le schéma tel quel.
  # À remplacer au plus vite par `pnpm db:migrate --name init` (voir docs).
  echo "[chc] Aucune migration trouvée : création du schéma avec « prisma db push »."
  pnpm prisma db push
fi

exec pnpm start
