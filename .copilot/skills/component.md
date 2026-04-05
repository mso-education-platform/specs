Conventions pour créer un composant feature

- Placer les composants spécifiques aux features dans `app/src/components/ui-custom/`.
- Props: toujours typées en TypeScript; inclure une propriété `className?: string`.
- Export: `export default` pour le composant principal.
- Styles: `className` doit être fusionnable via `cn()` afin d'autoriser l'extension externe.
- Théming: compatible light/dark en s'appuyant sur variables CSS et classes Tailwind.
- Tests: co-locater le test avec le composant (ex: `MyComp.test.tsx`) dans le même dossier.

Checklist rapide:
- Props typées
- `className` propagée et mergée via `cn()`
- Accessible (aria où nécessaire)
- Test unitaire co-localisé
