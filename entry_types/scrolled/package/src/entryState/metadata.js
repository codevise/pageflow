import {useMemo} from 'react';

import {useEntryStateCollectionItems} from './EntryStateProvider';
import {useTheme} from './theme';

/**
 * Returns a nested data structure representing the metadata of the entry.
 *
 * @example
 *
 * const metaData = useEntryMetadata();
 * metaData // =>
 *   {
 *     id: 5,
 *     locale: 'en',
 *     shareProviders: {email: false, facebook: true},
 *     share_url: 'http://test.host/test',
 *     credits: 'Credits: Pageflow',
 *     configuration: {darkWidgets: true}
 *   }
 */
export function useEntryMetadata() {
  const entries = useEntryStateCollectionItems('entries');

  return useMemo(() => {
    return entries[0];
  }, [entries]);
}

/**
 * Returns boolean indicating whether dark variant has been activated for
 * the widgets of the entry.
 */
export function useDarkWidgets() {
  const theme = useTheme();
  return useEntryMetadata().configuration.darkWidgets || theme.options.darkWidgets;
}
