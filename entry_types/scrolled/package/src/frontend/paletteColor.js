/**
 * Resolve a palette color to a CSS custom property.
 *
 * @example
 * <div style={{backgroundColor: paletteColor(configuration.backgroundColor)}}>
 */
export function paletteColor(value) {
  return !value || value[0] === '#' ?
         value :
         `var(--theme-palette-color-${value})`;
}
