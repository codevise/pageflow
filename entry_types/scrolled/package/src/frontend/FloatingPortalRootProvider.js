import {createContext, useContext} from 'react';

const FloatingPortalRootContext = createContext();

export function useFloatingPortalRoot() {
  return useContext(FloatingPortalRootContext);
}

export const FloatingPortalRootProvider = FloatingPortalRootContext.Provider;
