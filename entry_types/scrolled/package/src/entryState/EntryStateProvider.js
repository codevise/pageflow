import React, {useContext, useMemo} from 'react';

import {useCollections} from '../collections';

const Context = React.createContext();

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

export function useEntryState() {
  const value = useContext(Context);
  return value.entryState;
}

export function useEntryStateDispatch() {
  const value = useContext(Context);
  return value.dispatch;
}
