import useMediaQuery from './useMediaQuery';

export function useNarrowViewport() {
  return useMediaQuery('(max-width: 950px)');
}
