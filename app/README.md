# Learning Platform App

Application Next.js (App Router) pour la plateforme d'apprentissage.

## Prerequis

- Node.js 20+
- Docker
- npm

## Lancer en local (recommande)

1. Aller dans l'application:

```bash
cd app
```

2. Configurer la base de donnees locale sur un port dedie (evite les conflits avec un Postgres deja installe sur 5432):

```env
DATABASE_URL="postgres://specs:secret@127.0.0.1:55432/specs_db"
```

3. Demarrer Postgres dans Docker:

```bash
docker rm -f specs-postgres || true
docker run -d --name specs-postgres \
	-e POSTGRES_USER=specs \
	-e POSTGRES_PASSWORD=secret \
	-e POSTGRES_DB=specs_db \
	-p 55432:5432 \
	postgres:15
```

4. Installer les dependances:

```bash
npm ci
```

5. Initialiser la base:

```bash
npx prisma db push
npm run prisma:seed
```

6. Lancer l'application:

```bash
npm run dev
```

7. Ouvrir:

```text
http://localhost:3000
```

## Tests utiles

```bash
npm run lint
npm run test
npm run test:e2e -- tests/e2e/us1-onboarding.spec.ts
```

## Depannage rapide

- Si `/api/onboarding` retourne `Unexpected error`, verifier que l'app utilise bien la DB Docker sur `127.0.0.1:55432`.
- Si le port `3000` est occupe:

```bash
lsof -nP -iTCP:3000 -sTCP:LISTEN
kill <PID>
```

- Si le conteneur DB est stale, le recreer avec les commandes Docker ci-dessus puis rejouer:

```bash
npx prisma db push
npm run prisma:seed
```
