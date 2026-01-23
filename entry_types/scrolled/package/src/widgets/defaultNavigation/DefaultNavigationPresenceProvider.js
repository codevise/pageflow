import React, {createContext, useContext, useState, useCallback, useMemo} from 'react';
import classNames from 'classnames';

import {
  useScrollPosition,
  useOnUnmuteMedia,
  usePhonePlatform
} from 'pageflow-scrolled/frontend';

import styles from './presenceClassNames.module.css';

const DefaultNavigationContext = createContext({
  navExpanded: true,
  setNavExpanded: () => {}
});

export function useDefaultNavigationState() {
  return useContext(DefaultNavigationContext);
}

export function DefaultNavigationPresenceProvider({configuration, children}) {
  const [navExpanded, setNavExpanded] = useState(true);
  const isPhonePlatform = usePhonePlatform();

  useScrollPosition(
    ({prevPos, currPos}) => {
      const expand = currPos.y > prevPos.y ||
                     // Mobile Safari reports positive scroll position
                     // during scroll bounce animation when scrolling
                     // back to the top. Make sure navigation bar
                     // stays expanded:
                     currPos.y >= 0;
      if (expand !== navExpanded) setNavExpanded(expand);
    },
    [navExpanded]
  );

  useOnUnmuteMedia(useCallback(() => setNavExpanded(true), []));

  const alwaysExpanded = !isPhonePlatform && configuration.fixedOnDesktop;
  const expanded = navExpanded || alwaysExpanded;

  const className = classNames(
    styles.widgetMarginMax,
    {
      [styles.widgetMarginMin]: configuration.firstBackdropBelowNavigation &&
                                configuration.fixedOnDesktop &&
                                !isPhonePlatform,
      [styles.expanded]: expanded
    }
  );

  const contextValue = useMemo(
    () => ({navExpanded, setNavExpanded}),
    [navExpanded]
  );

  return (
    <DefaultNavigationContext.Provider value={contextValue}>
      <div className={className}>
        {children}
      </div>
    </DefaultNavigationContext.Provider>
  );
}
