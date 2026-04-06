Conventions for tRPC API routes

- All tRPC routers should live under `app/src/server/api/routers/`.
- Validation: every input must be validated with Zod before any business logic.
- Separation of concerns: all business logic must live in `app/src/server/application/`.
- Domain model: `app/src/server/domain/` contains entities and business rules.
- Infrastructure: `app/src/server/infrastructure/` contains implementations (DB, external clients).
- Absolute rule: never import from `infrastructure/` into `domain/`.

Minimal organization example:

- `routers/` → tRPC route definitions + Zod validation
- `application/` → use cases invoked by routers
- `infrastructure/` → adapters (Prisma, Redis, etc.)
