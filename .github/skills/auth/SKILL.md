---
name: auth
description: Authentication conventions for the project. Use when implementing auth flows and protecting routes.
---

Conventions for authentication:
- Use Auth.js v5 (next-auth)
- Server-side sessions available via `auth()`
- Client-side access via `useSession()`
- Protect a page by checking in the group's layout (auth)
- Protect a tRPC route using `protectedProcedure`
- Never store sensitive data in the JWT token
