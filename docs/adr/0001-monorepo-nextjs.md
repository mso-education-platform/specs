Title: 0001 - Monorepo with Next.js app/

Context
-------
Projet solo avec spécifications générées par SpecKit. On souhaite garder une seule racine
pour faciliter la découverte des specs et la simplicité des pipelines CI.

Alternatives considérées
------------------------
- Repo séparé front/back — complexité accrue pour CI et synchronisation des specs.
- Turborepo — utile pour mono-repo multi-paquets mais overkill pour ce projet solo.

Decision
--------
Garder un monorepo unique: Next.js dans `app/`, specs dans `specs/`.

Conséquences
------------
- Simplicité: un seul pipeline CI.
- Les tests et la distribution restent centralisés.
- Nécessite discipline sur séparation d'artefacts (ex: `server/` clairement limités).
