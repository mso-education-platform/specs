Name: Learning Platform

Stack: Next.js 15 App Router, TypeScript strict, Tailwind CSS, shadcn/ui, tRPC, Prisma, PostgreSQL

Structure: l'app vit dans `app/`, les specs sont dans `specs/` (générées par SpecKit)

Architecture: hexagonale — `domain` → `application` → `infrastructure`

Règle absolue: jamais d'import depuis `infrastructure/` vers `domain/`.

Règle de nommage: les noms de fichiers, classes, variables et symboles doivent rester en anglais (les traductions doivent se limiter au contenu affiché à l'utilisateur, pas aux identifiants du code).

Conventions commits: `feat|fix|chore` + référence Issue SpecKit. Ex: "feat: add auth flow, closes #12".

Processus pour implémenter une spec:
- Lire `specs/[n]-.../spec.md`
- Respecter les critères d'acceptance
- Référencer l'Issue correspondante dans le commit
