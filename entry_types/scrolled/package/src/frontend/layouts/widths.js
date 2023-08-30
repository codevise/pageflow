export const widths = {
  xxs: -3,
  xs: -2,
  sm: -1,
  md: 0,
  lg: 1,
  xl: 2,
  full: 3
}

export function widthName(width) {
  return Object.keys(widths)[(width || 0) + 3];
}
