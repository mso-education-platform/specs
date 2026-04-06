Conventions for creating a feature component

- Place feature-specific components in `app/src/components/ui-custom/`.
- Props: always typed in TypeScript; include a `className?: string` prop.
- Export: use `export default` for the main component.
- Styles: `className` must be mergeable via `cn()` to allow external extension.
- Theming: support light/dark using CSS variables and Tailwind classes.
- Tests: colocate the test with the component (e.g., `MyComp.test.tsx`) in the same folder.

Quick checklist:
- Props are typed
- `className` is forwarded and merged via `cn()`
- Accessible (use ARIA where needed)
- Unit test colocated

Internationalization (i18n)

- Location: centralize translation files under `src/i18n/messages/` by locale (e.g., `en.json`, `fr.json`) or by namespace if needed.
- Keys: use semantic, hierarchical keys (e.g., `onboarding.title`, `button.submit`).
- Extraction: do not hardcode text in components — inject via props or the i18n hooks provided by the project (e.g., `useTranslations()` or `t()`).
- Typing: provide types for translation keys when possible (e.g., `type LocaleKeys = keyof typeof messages['en']`) to avoid key typos.
- Interpolation & plurals: handle interpolation and plural rules via the project's i18n library; document placeholders (`{count}`, `{name}`) and related tests.
- Fallbacks: ensure a `fallbackLocale` and a clear strategy when a key is missing (log + fallback string).
- Formatting: use `Intl` for dates/numbers/currencies and avoid embedding formatting logic inside translation files.
- Tests: colocate i18n rendering tests (e.g., verify the component renders localized text for a given locale).
- PR checklist: ask reviewers to verify the addition of translation keys and presence of locale variants.
