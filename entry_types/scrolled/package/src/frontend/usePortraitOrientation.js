import useMediaQuery from './useMediaQuery';

/**
 * Returns boolean indicating whether viewport orientation is currently
 * portrait.
 */
export function usePortraitOrientation() {
  return useMediaQuery('(orientation: portrait)');
}
