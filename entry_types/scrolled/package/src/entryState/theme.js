import {useEntryStateConfig} from "./EntryStateProvider";

/**
 * Returns an object containing theme asset paths.
 *
 * @example
 *
 * const theme = useTheme();
 * theme // =>
 *   {
 *     assets: {
 *       logoDesktop: 'path/to/logoDesktop.svg',
 *       logoMobile: 'path/to/logoMobile.svg'
 *     },
 *     options: {
 *       // options passed to `themes.register` in `pageflow.rb` initializer
 *       // with camleized keys.
 *     }
 *   }
 */
export function useTheme() {
  const config = useEntryStateConfig();

  return config.theme;
}
