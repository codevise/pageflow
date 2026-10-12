import {useEntryStateCollectionItem} from './EntryStateProvider';

export function useLinkedEntry(entryId) {
  return useEntryStateCollectionItem('linkedEntries', entryId);
}

export function useLinkedEntryUrl({entry: entryId}) {
  return useLinkedEntry(entryId)?.url;
}
