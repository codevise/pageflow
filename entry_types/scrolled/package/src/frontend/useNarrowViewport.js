import useMediaQuery from './useMediaQuery';
import {useTheme} from '../entryState';

export function useNarrowViewport() {
  const theme = useTheme();
  const maxWidth = theme.options.properties?.root?.narrowViewportBreakpoint ||
                   '950px';

  return useMediaQuery(`(max-width: ${maxWidth})`);
}
