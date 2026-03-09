export function isTranslucentColor(color) {
  return !!color && color.length > 7 && color.slice(-2).toLowerCase() !== 'ff';
}
