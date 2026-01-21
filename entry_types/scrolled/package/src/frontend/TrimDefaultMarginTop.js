import {createContext, useContext} from 'react';

const TrimDefaultMarginTopContext = createContext(false);

export const TrimDefaultMarginTop = TrimDefaultMarginTopContext.Provider;

export function useTrimDefaultMarginTop() {
  return useContext(TrimDefaultMarginTopContext);
}
