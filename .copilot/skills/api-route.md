Conventions pour les routes API tRPC

- Tous les routers tRPC doivent vivre sous `app/src/server/api/routers/`.
- Validation: chaque input doit être validé avec Zod avant toute logique métier.
- Séparation des responsabilités: toute logique métier doit résider dans `app/src/server/application/`.
- Domain model: `app/src/server/domain/` contient entités et règles métier.
- Infrastructure: `app/src/server/infrastructure/` contient implémentations (DB, clients externes).
- Règle absolue: ne jamais importer depuis `infrastructure/` dans `domain/`.

Exemple minimal d'organisation:

- `routers/` → définition des routes tRPC + validation Zod
- `application/` → cas d'utilisation (use-cases) invoqués par les routers
- `infrastructure/` → adaptateurs (Prisma, Redis, etc.)
