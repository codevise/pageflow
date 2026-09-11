import { browser } from 'pageflow/frontend';
import React, { createContext, useContext, useState, useEffect } from 'react';

const BrowserFeaturesAvailableContext = createContext();

// Browser feature detection is not available during server side
// rendering. To prevent mismatches during hydration, we keep features
// disabled in the initial render. Since hydration only starts after
// feature detection has finished, we can immediately re-render once
// the provider has mounted.
function BrowserFeaturesProvider({
  children
}) {
  const [isAvailable, setIsAvailable] = useState(false);
  useEffect(() => setIsAvailable(true), []);
  return /*#__PURE__*/React.createElement(BrowserFeaturesAvailableContext.Provider, {
    value: isAvailable
  }, children);
}
function useBrowserFeature(name) {
  return useContext(BrowserFeaturesAvailableContext) && browser.has(name);
}

const PhonePlatformContext = React.createContext(false);

export { BrowserFeaturesProvider as B, PhonePlatformContext as P, useBrowserFeature as u };
