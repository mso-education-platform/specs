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

Internationalisation (i18n)

- Emplacement: centraliser les fichiers de traduction sous `src/i18n/messages/` par locale (ex: `en.json`, `fr.json`) ou par namespace si nécessaire.
- Clés: utiliser des clés sémantiques et hiérarchiques (ex: `onboarding.title`, `button.submit`).
- Extraction: ne pas hardcoder de texte dans les composants — injecter via props ou via hooks fournis par le provider i18n (ex: `useTranslations()` ou `t()`).
- Typage: fournir des types pour les clés de traduction quand possible (ex: `type LocaleKeys = keyof typeof messages['en']`) pour éviter les fautes de clés.
- Interpolation & pluriels: gérer l'interpolation et les règles de pluralisation via la librairie i18n du projet; documenter les placeholders (`{count}`, `{name}`) et les tests associés.
- Fallbacks: s'assurer d'un `fallbackLocale` et d'une stratégie claire si une clé est manquante (log + fallback string).
- Formatage: utiliser `Intl` pour dates/nombres/monnaies et éviter d'imbriquer format logique dans les fichiers de traduction.
- Tests: co-localiser des tests de rendu i18n (ex: vérifier que le composant affiche la clé traduite pour une locale donnée).
- PR checklist: demander au reviewer de vérifier l'ajout de la clé de traduction et la présence des variantes de locale.
