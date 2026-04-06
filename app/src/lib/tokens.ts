/**
 * Design tokens centralisés pour l'application
 * Fournissent des tailles, espacements, breakpoints et z-index réutilisables.
 */

/**
 * Tailles de texte (rem)
 */
export const fontSizes = {
  sm: '0.875rem',
  base: '1rem',
  lg: '1.125rem',
  xl: '1.25rem',
  '2xl': '1.5rem',
  '3xl': '1.875rem',
} as const;

/**
 * Échelle d'espacement (1..16) en px — multiples de 4px
 */
export const spacing = {
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  7: '28px',
  8: '32px',
  9: '36px',
  10: '40px',
  11: '44px',
  12: '48px',
  13: '52px',
  14: '56px',
  15: '60px',
  16: '64px',
} as const;

/**
 * Breakpoints responsive (px)
 */
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

/**
 * Durées d'animation en ms
 */
export const animationDurations = {
  fast: 150,
  normal: 300,
  slow: 500,
} as const;

/**
 * Z-index nommés
 */
export const zIndices = {
  base: 0,
  dropdown: 1000,
  modal: 1100,
  toast: 1200,
  overlay: 1300,
} as const;

export type FontSizes = typeof fontSizes;
export type Spacing = typeof spacing;
export type Breakpoints = typeof breakpoints;
export type AnimationDurations = typeof animationDurations;
export type ZIndices = typeof zIndices;
