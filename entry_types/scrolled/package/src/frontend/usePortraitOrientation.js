import useMediaQuery from './useMediaQuery';

export function usePortraitOrientation() {
  return useMediaQuery('(orientation: portrait)');
}
