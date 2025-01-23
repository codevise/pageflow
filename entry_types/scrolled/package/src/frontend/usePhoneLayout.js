import React, {createContext, useContext} from 'react';

import breakpoints from '../../values/breakpoints.module.css';
import useMediaQuery from './useMediaQuery';

const PhoneLayoutContext = createContext(false);

export function PhoneLayoutProvider({children}) {
  const phoneLayout = useMediaQuery(breakpoints['breakpoint-below-sm'])

  return (
    <PhoneLayoutContext.Provider value={phoneLayout}>
      {children}
    </PhoneLayoutContext.Provider>
  );
}

export function usePhoneLayout() {
  return useContext(PhoneLayoutContext);
}
