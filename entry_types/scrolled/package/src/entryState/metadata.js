import {useMemo} from 'react';

import {useEntryStateCollectionItems} from './EntryStateProvider';

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
 *     credits: 'Credits: Pageflow'
 *   }
 */
export function useEntryMetadata() {
  const entries = useEntryStateCollectionItems('entries');

  return useMemo(() => {
    return entries[0];
  }, [entries]);
}
