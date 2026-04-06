# specs Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-04-05

## Active Technologies

- TypeScript 5.x, Node.js 20+, Next.js 15 App Router + Next.js, React, Prisma ORM, Zod, NextAuth/Auth.js (or existing auth), shadcn/ui components already present in `src/components/ui` (1-learning-platform)
- PostgreSQL via Prisma (`app/prisma/schema.prisma`) (1-learning-platform)

## Project Structure

```text
app/
specs/
```

## Commands

npm --prefix app run lint
npm --prefix app run test
npm --prefix app run dev

## Code Style

TypeScript: Follow strict typing, small composable modules, and clear separation between route handlers, services, repositories, and UI components.

## Recent Changes

- 1-learning-platform: Added TypeScript + Next.js/Prisma learning platform architecture planning artifacts and contracts

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
