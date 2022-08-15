import React from 'react';

export const MotifAreaVisibilityContext = React.createContext(false);

export function MotifAreaVisibilityProvider({visible, children}) {
  return (
    <MotifAreaVisibilityContext.Provider value={visible}>
      {children}
    </MotifAreaVisibilityContext.Provider>
  );
}
