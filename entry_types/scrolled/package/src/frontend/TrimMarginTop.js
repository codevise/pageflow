import {createContext, useContext} from 'react';

const TrimMarginTopContext = createContext(false);

export const TrimMarginTopProvider = TrimMarginTopContext.Provider;

export function useTrimMarginTop() {
  return useContext(TrimMarginTopContext);
}
