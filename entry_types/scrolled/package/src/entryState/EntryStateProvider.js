import React from 'react';

export const EntryStateContext = React.createContext();

export function EntryStateProvider({state, children}) {
  return (
    <EntryStateContext.Provider value={state}>
      {children}
    </EntryStateContext.Provider>
  );
}
