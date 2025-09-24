import { browser } from 'pageflow/frontend';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { _ as _slicedToArray } from './ThemeIcon-87fcf0dd.js';

var BrowserFeaturesAvailableContext = createContext();

// Browser feature detection is not available during server side
// rendering. To prevent mismatches during hydration, we keep features
// disabled in the initial render. Since hydration only starts after
// feature detection has finished, we can immediately re-render once
// the provider has mounted.
function BrowserFeaturesProvider(_ref) {
  var children = _ref.children;
  var _useState = useState(false),
    _useState2 = _slicedToArray(_useState, 2),
    isAvailable = _useState2[0],
    setIsAvailable = _useState2[1];
  useEffect(function () {
    return setIsAvailable(true);
  }, []);
  return /*#__PURE__*/React.createElement(BrowserFeaturesAvailableContext.Provider, {
    value: isAvailable
  }, children);
}
function useBrowserFeature(name) {
  return useContext(BrowserFeaturesAvailableContext) && browser.has(name);
}

var PhonePlatformContext = React.createContext(false);

export { BrowserFeaturesProvider as B, PhonePlatformContext as P, useBrowserFeature as u };
