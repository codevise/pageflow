/**
 * Resolve a palette color to a CSS custom property.
 *
 * @example
 * <div style={{backgroundColor: paletteColor(configuration.backgroundColor)}}>
 */
export function paletteColor(name) {
  return name && `var(--theme-palette-color-${name})`;
}
