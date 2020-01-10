import {useContext} from 'react';

import {getItem} from '../collections';

import {EntryStateContext} from './EntryStateProvider';
import {expandUrls} from './expandUrls';

export function useFile({collectionName, permaId}) {
  const entryState = useContext(EntryStateContext);

  return expandUrls(
    collectionName,
    getItem(entryState.collections, collectionName, permaId),
    entryState.config.fileUrlTemplates
  );
}
