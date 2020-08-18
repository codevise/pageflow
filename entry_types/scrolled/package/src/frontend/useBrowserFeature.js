import React, {createContext, useContext, useState, useEffect} from 'react';
import {browser} from 'pageflow/frontend';

const BrowserFeaturesAvailableContext = createContext();

// Browser feature detection is not available during server side
// rendering. To prevent mismatches during hydration, we keep features
// disabled in the initial render. Since hydration only starts after
// feature detection has finished, we can immediately re-render once
// the provider has mounted.
export function BrowserFeaturesProvider({children}) {
  const [isAvailable, setIsAvailable] = useState(false);

  useEffect(() => setIsAvailable(true), []);

  return (
    <BrowserFeaturesAvailableContext.Provider value={isAvailable}>
      {children}
    </BrowserFeaturesAvailableContext.Provider>
  );
}

export function useBrowserFeature(name) {
  return useContext(BrowserFeaturesAvailableContext) && browser.has(name);
}
