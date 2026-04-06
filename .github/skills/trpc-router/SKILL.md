---
name: trpc-router
description: Convention for creating tRPC routers and registration in root.
---

Convention for creating a router in `src/server/api/routers/`:
- One file per domain (e.g., `course.router.ts`)
- Always use `protectedProcedure` for authenticated routes
- Input validated with Zod; never use `any`
- The router should call only use cases; never call Prisma directly
- Register the router in `src/server/api/root.ts`
- Include a complete router example
