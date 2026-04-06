---
name: prisma-schema
description: Conventions for editing Prisma schema and migration steps.
---

Conventions for editing `app/prisma/schema.prisma`:
- Always add `createdAt` / `updatedAt` fields to each model
- Naming: PascalCase for models, camelCase for fields
- After each change: run `npx prisma migrate dev --name [name]` then `npx prisma generate`
- Never create a relation without an explicit index
- Include a canonical example model for reference
