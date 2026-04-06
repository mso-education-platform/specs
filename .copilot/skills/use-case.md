Convention for creating a use case in `src/server/application/`:
- One file = one use case (e.g., `createCourse.ts`)
- Structure: exported async function, input typed with Zod, output typed in TypeScript
- Never import directly from `infrastructure/`; go through a port interface defined in `domain/`
- Always include a colocated test file `[name].test.ts`
- Include a complete example of the use case