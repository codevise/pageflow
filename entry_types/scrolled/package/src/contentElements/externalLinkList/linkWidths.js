import {contentElementWidths} from 'pageflow-scrolled/frontend';

export const linkWidths = {
  xs: -2,
  sm: -1,
  md: 0,
  lg: 1,
  xl: 2,
  xxl: 3
}

export function maxLinkWidth({layout, textPosition, width}) {
  if (layout === 'center' || layout === 'centerRagged') {
    if (textPosition === 'right') {
      return {
        [contentElementWidths.md]: linkWidths.md,
        [contentElementWidths.lg]: linkWidths.lg,
        [contentElementWidths.xl]: linkWidths.xl,
        [contentElementWidths.full]: linkWidths.xl,
      }[width];
    }
    else {
      return {
        [contentElementWidths.md]: linkWidths.lg,
        [contentElementWidths.lg]: linkWidths.xl,
        [contentElementWidths.xl]: linkWidths.xxl,
        [contentElementWidths.full]: linkWidths.xxl,
      }[width];
    }
  }
  else {
    if (textPosition === 'right') {
      return {
        [contentElementWidths.md]: linkWidths.sm,
        [contentElementWidths.lg]: linkWidths.md,
        [contentElementWidths.xl]: linkWidths.xl,
        [contentElementWidths.full]: linkWidths.xl,
      }[width];
    }
    else {
      return {
        [contentElementWidths.md]: linkWidths.lg,
        [contentElementWidths.lg]: linkWidths.lg,
        [contentElementWidths.xl]: linkWidths.xxl,
        [contentElementWidths.full]: linkWidths.xxl,
      }[width];
    }
  }
}
