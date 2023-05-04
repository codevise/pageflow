import React, {useMemo} from 'react';
import {createContext, useContextSelector} from 'use-context-selector';

import {
  useCollections,
  getItem,
  createItemsSelector,
  createMultipleItemsSelector
} from '../collections';

const Context = createContext();

export function EntryStateProvider({seed, children}) {
  const [collections, dispatch] = useCollections(seed.collections, {keyAttribute: 'permaId'});

  const value = useMemo(() => ({
    entryState: {
      collections,
      config: seed.config
    },
    dispatch
  }), [collections, dispatch, seed]);

  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  );
}

function useEntryState(selector = entryState => entryState) {
  return useContextSelector(Context, value => selector(value.entryState));
}

export function useEntryStateDispatch() {
  return useContextSelector(Context, value => value.dispatch);
}

export function useEntryStateConfig() {
  return useEntryState(entryState => entryState.config);
}

export function useEntryStateCollectionItem(collectionName, key) {
  return useEntryState(entryState => getItem(entryState.collections, collectionName, key));
}

export function useEntryStateCollectionItems(collectionName, filter) {
  const itemsSelector = useMemo(
    () => createItemsSelector(collectionName, filter),
    [collectionName, filter]
  );

  return useEntryState(entryState => itemsSelector(entryState.collections));
}

export function useMultipleEntryStateCollectionItems(collectionNames) {
  const multipleItemsSelector = useMemo(
    () => createMultipleItemsSelector(collectionNames),
    [collectionNames]
  );

  return useEntryState(entryState => multipleItemsSelector(entryState.collections));
}
