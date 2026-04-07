# Learning Platform App

A Next.js App Router application for the learning platform.

## Prerequisites

- Node.js 20+
- Docker
- npm

## Run Locally (Recommended)

**Option 1 — Use GitHub Copilot Chat (recommended for interactive guidance)**

You can run this setup interactively using GitHub Copilot Chat (or any prompt tool) by loading the prompt file at [.github/prompts/run-local-app.prompt.md](.github/prompts/run-local-app.prompt.md). Open Copilot Chat in VS Code, paste the example request below and follow the steps it returns.

Example Copilot request (copy/paste into Copilot Chat):

```text
Please run the checklist in `.github/prompts/run-local-app.prompt.md` to:
- start a Postgres Docker container (use a named volume `specs_pgdata`),
- apply the Prisma schema (`npx prisma db push`),
- run the seed script (`npm run prisma:seed`),
- and start the Next.js app in development (`npm run dev`).

After each command, show the command output and stop if an error occurs. Confirm when the app is available at http://localhost:3000.
```

**Option 2 — Manual (copy/paste commands)**

1. Go to the app directory:

```bash
cd app
```

2. Configure the local database URL on a dedicated port (avoids conflicts with an existing local Postgres on 5432):

```env
DATABASE_URL="postgres://specs:secret@127.0.0.1:55432/specs_db"
```

3. Start Postgres in Docker:

The command below creates a fresh Postgres container. Note: the `docker rm -f` line removes the container — if you don't mount a Docker volume, any database data stored inside the container will be lost when the container is removed. If you need data to persist across container recreation, use a Docker volume or a host bind mount (examples follow).

Ephemeral (no persisted data):

```bash
docker rm -f specs-postgres || true
docker run -d --name specs-postgres \
	-e POSTGRES_USER=specs \
	-e POSTGRES_PASSWORD=secret \
	-e POSTGRES_DB=specs_db \
	-p 55432:5432 \
	postgres:15
```

Recommended — Named Docker volume (data persists even if the container is removed):

```bash
docker rm -f specs-postgres || true
docker run -d --name specs-postgres \
	-e POSTGRES_USER=specs \
	-e POSTGRES_PASSWORD=secret \
	-e POSTGRES_DB=specs_db \
	-p 55432:5432 \
	-v specs_pgdata:/var/lib/postgresql/data \
	postgres:15
```

Alternative — Host bind mount (store data in a specific host folder):

```bash
mkdir -p /path/to/pgdata
docker rm -f specs-postgres || true
docker run -d --name specs-postgres \
	-e POSTGRES_USER=specs \
	-e POSTGRES_PASSWORD=secret \
	-e POSTGRES_DB=specs_db \
	-p 55432:5432 \
	-v /path/to/pgdata:/var/lib/postgresql/data \
	postgres:15
```

Notes:
- To stop and later restart the same container without removing data: `docker stop specs-postgres` then `docker start specs-postgres`.
- Removing a container with `docker rm` does not delete named volumes. To remove the volume too: `docker volume rm specs_pgdata`.
- If you use a host bind mount, the DB files will remain on your host at `/path/to/pgdata`.

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
