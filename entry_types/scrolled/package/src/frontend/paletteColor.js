/**
 * Resolve a palette color to a CSS custom property.
 *
 * @example
 * <div style={{backgroundColor: paletteColor(configuration.backgroundColor)}}>
 */
export function paletteColor(value) {
  if (!value) {
    return undefined;
  }

  if (value[0] === '#') {
    return value;
  }

  return `var(--theme-palette-color-${value})`;
}
