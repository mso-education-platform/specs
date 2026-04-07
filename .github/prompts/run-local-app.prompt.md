---
name: Start the app locally (EN)
description: Step-by-step guide to start Postgres in Docker, apply the Prisma schema, run the seed, and start the app in development.
---
 
Context: you are a developer who needs to run the Next.js application locally from the repository root. The main app folder is `app` and the database used is Postgres (Prisma).

Goal: provide clear, copy/pasteable instructions to start the DB, apply the schema, run the seed, and launch the app in development mode.

Checklist (run each block in a terminal from the repo root):

1) Change to the app folder

```bash
cd app
```

2) Set the local environment variable (a dedicated port avoids conflicts)

```bash
export DATABASE_URL="postgres://specs:secret@127.0.0.1:55432/specs_db"
```

(Optional: add the same line to a `.env` file if desired.)

3) Start Postgres in Docker (recommended: named volume for persistence)

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

Note: without `-v`, data is stored in the container and will be lost if you remove it.

4) Install dependencies

```bash
npm ci
```

5) Apply the Prisma schema (creates/updates tables)

```bash
npx prisma db push
```

6) Run the seed (populate the DB)

```bash
npm run prisma:seed
```

7) Start the app in development mode

```bash
npm run dev
```

8) Open the app

http://localhost:3000

9) Quick checks

- List tables from the container:

```bash
docker exec -i specs-postgres psql -U specs -d specs_db -c "\dt"
```

- If `psql` is installed locally:

```bash
PGPASSWORD=secret psql -h 127.0.0.1 -p 55432 -U specs -d specs_db -c "\dt"
```

10) Common troubleshooting

- Port 3000 in use: `lsof -nP -iTCP:3000 -sTCP:LISTEN` then `kill <PID>`
- DB connection error: check `DATABASE_URL`, `docker ps`, and the `55432:5432` mapping.
- Container recreated but data lost: use the named volume (`specs_pgdata`) or a bind mount `-v /path/pgdata:/var/lib/postgresql/data`.

End of prompt — copy/paste each block and verify command output before running the next one.
