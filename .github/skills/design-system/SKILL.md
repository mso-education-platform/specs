---
name: design-system
description: Project UI and design system conventions for components and styling.
---

Project UI conventions

- Use only the components provided by shadcn/ui.
- When composing Tailwind classes, always use the `cn()` helper.
- Never hardcode colors as hex values; use CSS variables like `--primary`, `--secondary`, etc.
- Typical component structure:
  - Props typed in TypeScript (`interface` or `type`), include `className?: string`.
  - Component exported as default for the main component.
  - `className` must be mergeable via `cn(baseClasses, className)`.
  - Explicit light/dark support via CSS variables and Tailwind utilities.

Minimal example:

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
