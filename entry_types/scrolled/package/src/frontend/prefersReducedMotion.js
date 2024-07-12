export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion)').matches;
}
