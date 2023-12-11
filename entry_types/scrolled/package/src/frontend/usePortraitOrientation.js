import useMediaQuery from './useMediaQuery';

/**
 * Returns boolean indicating whether viewport orientation is currently
 * portrait.
 */
export function usePortraitOrientation(options) {
  return useMediaQuery('(orientation: portrait)', options);
}
