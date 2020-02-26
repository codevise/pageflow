import {useMemo} from 'react';

import {useEntryState} from './EntryStateProvider';
import {getItems} from '../collections';

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
  const entryState = useEntryState();

  return useMemo(() => {
    return getItems(entryState.collections, 'entries')[0];
  }, [entryState]);
}
