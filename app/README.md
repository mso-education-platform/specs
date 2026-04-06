# Learning Platform App

A Next.js App Router application for the learning platform.

## Prerequisites

- Node.js 20+
- Docker
- npm

## Run Locally (Recommended)

1. Go to the app directory:

```bash
cd app
```

2. Configure the local database URL on a dedicated port (avoids conflicts with an existing local Postgres on 5432):

```env
DATABASE_URL="postgres://specs:secret@127.0.0.1:55432/specs_db"
```

3. Start Postgres in Docker:

```bash
docker rm -f specs-postgres || true
docker run -d --name specs-postgres \
	-e POSTGRES_USER=specs \
	-e POSTGRES_PASSWORD=secret \
	-e POSTGRES_DB=specs_db \
	-p 55432:5432 \
	postgres:15
```

4. Install dependencies:

```bash
npm ci
```

5. Initialize the database:

```bash
npx prisma db push
npm run prisma:seed
```

6. Start the app:

```bash
npm run dev
```

7. Open:

```text
http://localhost:3000
```

## Useful Test Commands

```bash
npm run lint
npm run test
npm run test:e2e -- tests/e2e/us1-onboarding.spec.ts
```

## Quick Troubleshooting

- If `/api/onboarding` returns `Unexpected error`, verify the app is using the Docker DB at `127.0.0.1:55432`.
- If port `3000` is already in use:

```bash
lsof -nP -iTCP:3000 -sTCP:LISTEN
kill <PID>
```

- If the DB container is stale, recreate it with the Docker commands above, then re-run:

```bash
npx prisma db push
npm run prisma:seed
```
