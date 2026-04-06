Conventions UI du projet

- Utiliser exclusivement les composants fournis par shadcn/ui.
- Pour composer des classes Tailwind, toujours utiliser la fonction `cn()`.
- Ne jamais hardcoder de couleurs en hex; utiliser des variables CSS `--primary`, `--secondary`, etc.
- Structure type d'un composant:
  - Props typées en TypeScript (interface ou type), inclure une `className?: string`.
  - Composant exporté par défaut.
  - `className` doit être fusionnable via `cn(baseClasses, className)`.
  - Support explicite light/dark via variables CSS et utilitaires Tailwind.

Exemple minimal:

```
interface MyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
  className?: string
}

export default function MyButton({ variant = 'primary', className, ...props }: MyButtonProps) {
  return (
    <button className={cn('px-4 py-2 rounded', className)} {...props} />
  )
}
```
