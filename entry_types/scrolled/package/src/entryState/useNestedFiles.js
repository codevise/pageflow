import {getItems} from '../collections';

import {useEntryState} from './EntryStateProvider';
import {extendFile} from './extendFile';

export function useNestedFiles({collectionName, parent}) {
  const entryState = useEntryState();

  if (!parent) {
    return [];
  }

  return getItems(entryState.collections, collectionName).filter(file => {
    return file.parentFileId === parent.id &&
           file.parentFileModelType === parent.modelType;
  }).map(file => extendFile(collectionName, file, entryState));
}
