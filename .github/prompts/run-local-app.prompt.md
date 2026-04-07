---
name: Lancer l'app localement (FR)
description: Guide pas-à-pas pour démarrer Postgres en Docker, appliquer le schéma Prisma, seed et lancer l'application en dev.
---

Contexte : tu es un·e développeur·se qui doit lancer l'application Next.js localement depuis la racine du dépôt. Le dossier principal de l'app est `app` et la base de données utilisée est Postgres (Prisma).

Objectif : fournir des instructions claires, copiable/collable, pour démarrer la DB, appliquer le schéma, exécuter le seed et lancer l'app en mode développement.

Checklist (exécuter chaque bloc dans un terminal depuis la racine du repo) :

1) Aller dans le dossier de l'app

```bash
cd app
```

2) Définir la variable d'environnement locale (port dédié évite les conflits)

```bash
export DATABASE_URL="postgres://specs:secret@127.0.0.1:55432/specs_db"
```

(Option: ajouter la même ligne dans un fichier `.env` si souhaité.)

3) Démarrer Postgres Docker (recommandé : volume nommé pour persistance)

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

Remarque : sans `-v` les données sont stockées dans le conteneur et seront perdues si vous le supprimez.

4) Installer les dépendances

```bash
npm ci
```

5) Appliquer le schéma Prisma (crée/alerte les tables)

```bash
npx prisma db push
```

6) Lancer le seed (peupler la DB)

```bash
npm run prisma:seed
```

7) Lancer l'app en mode développement

```bash
npm run dev
```

8) Ouvrir l'app

http://localhost:3000

9) Vérifications rapides

- Lister les tables depuis le conteneur :

```bash
docker exec -i specs-postgres psql -U specs -d specs_db -c "\dt"
```

- Si `psql` est installé localement :

```bash
PGPASSWORD=secret psql -h 127.0.0.1 -p 55432 -U specs -d specs_db -c "\dt"
```

10) Résolution des problèmes courants

- Port 3000 occupé : `lsof -nP -iTCP:3000 -sTCP:LISTEN` puis `kill <PID>`
- Erreur de connexion DB : vérifier `DATABASE_URL`, `docker ps`, et le mapping `55432:5432`.
- Conteneur recréé mais données perdues : utilisez le volume nommé (`specs_pgdata`) ou un bind-mount `-v /chemin/pgdata:/var/lib/postgresql/data`.

Fin du prompt — copier/coller chaque bloc et vérifier la sortie des commandes avant la suivante.
