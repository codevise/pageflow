export function widthName(width) {
  return [
    'xxs',
    'xs',
    'sm',
    'md',
    'lg',
    'xl',
    'full'
  ][(width || 0) + 3];
}
