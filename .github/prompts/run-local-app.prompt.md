---
<<<<<<< HEAD
name: Start the app locally (EN)
description: Step-by-step guide to start Postgres in Docker, apply the Prisma schema, run the seed, and start the app in development.
---
 
Context: you are a developer who needs to run the Next.js application locally from the repository root. The main app folder is `app` and the database used is Postgres (Prisma).

Goal: provide clear, copy/pasteable instructions to start the DB, apply the schema, run the seed, and launch the app in development mode.

Checklist (run each block in a terminal from the repo root):

1) Change to the app folder
=======
name: Lancer l'app localement (FR)
description: Guide pas-à-pas pour démarrer Postgres en Docker, appliquer le schéma Prisma, seed et lancer l'application en dev.
---

Contexte : tu es un·e développeur·se qui doit lancer l'application Next.js localement depuis la racine du dépôt. Le dossier principal de l'app est `app` et la base de données utilisée est Postgres (Prisma).

Objectif : fournir des instructions claires, copiable/collable, pour démarrer la DB, appliquer le schéma, exécuter le seed et lancer l'app en mode développement.

Checklist (exécuter chaque bloc dans un terminal depuis la racine du repo) :

1) Aller dans le dossier de l'app
>>>>>>> 98705c9 (fix(ui): learner sidebar + tracks onboarding CTA; i18n; handle missing active path)

```bash
cd app
```

<<<<<<< HEAD
2) Set the local environment variable (a dedicated port avoids conflicts)
=======
2) Définir la variable d'environnement locale (port dédié évite les conflits)
>>>>>>> 98705c9 (fix(ui): learner sidebar + tracks onboarding CTA; i18n; handle missing active path)

```bash
export DATABASE_URL="postgres://specs:secret@127.0.0.1:55432/specs_db"
```

<<<<<<< HEAD
(Optional: add the same line to a `.env` file if desired.)

3) Start Postgres in Docker (recommended: named volume for persistence)
=======
(Option: ajouter la même ligne dans un fichier `.env` si souhaité.)

3) Démarrer Postgres Docker (recommandé : volume nommé pour persistance)
>>>>>>> 98705c9 (fix(ui): learner sidebar + tracks onboarding CTA; i18n; handle missing active path)

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

<<<<<<< HEAD
Note: without `-v`, data is stored in the container and will be lost if you remove it.

4) Install dependencies
=======
Remarque : sans `-v` les données sont stockées dans le conteneur et seront perdues si vous le supprimez.

4) Installer les dépendances
>>>>>>> 98705c9 (fix(ui): learner sidebar + tracks onboarding CTA; i18n; handle missing active path)

```bash
npm ci
```

<<<<<<< HEAD
5) Apply the Prisma schema (creates/updates tables)
=======
5) Appliquer le schéma Prisma (crée/alerte les tables)
>>>>>>> 98705c9 (fix(ui): learner sidebar + tracks onboarding CTA; i18n; handle missing active path)

```bash
npx prisma db push
```

<<<<<<< HEAD
6) Run the seed (populate the DB)
=======
6) Lancer le seed (peupler la DB)
>>>>>>> 98705c9 (fix(ui): learner sidebar + tracks onboarding CTA; i18n; handle missing active path)

```bash
npm run prisma:seed
```

<<<<<<< HEAD
7) Start the app in development mode
=======
7) Lancer l'app en mode développement
>>>>>>> 98705c9 (fix(ui): learner sidebar + tracks onboarding CTA; i18n; handle missing active path)

```bash
npm run dev
```

<<<<<<< HEAD
8) Open the app

http://localhost:3000

9) Quick checks

- List tables from the container:
=======
8) Ouvrir l'app

http://localhost:3000

9) Vérifications rapides

- Lister les tables depuis le conteneur :
>>>>>>> 98705c9 (fix(ui): learner sidebar + tracks onboarding CTA; i18n; handle missing active path)

```bash
docker exec -i specs-postgres psql -U specs -d specs_db -c "\dt"
```

<<<<<<< HEAD
- If `psql` is installed locally:
=======
- Si `psql` est installé localement :
>>>>>>> 98705c9 (fix(ui): learner sidebar + tracks onboarding CTA; i18n; handle missing active path)

```bash
PGPASSWORD=secret psql -h 127.0.0.1 -p 55432 -U specs -d specs_db -c "\dt"
```

<<<<<<< HEAD
10) Common troubleshooting

- Port 3000 in use: `lsof -nP -iTCP:3000 -sTCP:LISTEN` then `kill <PID>`
- DB connection error: check `DATABASE_URL`, `docker ps`, and the `55432:5432` mapping.
- Container recreated but data lost: use the named volume (`specs_pgdata`) or a bind mount `-v /path/pgdata:/var/lib/postgresql/data`.

End of prompt — copy/paste each block and verify command output before running the next one.
=======
10) Résolution des problèmes courants

- Port 3000 occupé : `lsof -nP -iTCP:3000 -sTCP:LISTEN` puis `kill <PID>`
- Erreur de connexion DB : vérifier `DATABASE_URL`, `docker ps`, et le mapping `55432:5432`.
- Conteneur recréé mais données perdues : utilisez le volume nommé (`specs_pgdata`) ou un bind-mount `-v /chemin/pgdata:/var/lib/postgresql/data`.

Fin du prompt — copier/coller chaque bloc et vérifier la sortie des commandes avant la suivante.
>>>>>>> 98705c9 (fix(ui): learner sidebar + tracks onboarding CTA; i18n; handle missing active path)
