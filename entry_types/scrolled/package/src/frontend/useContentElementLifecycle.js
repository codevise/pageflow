import React, {useRef, useContext, useMemo, createContext} from 'react';

import {useOnScreen} from './useOnScreen';
import {api} from './api';

const LifecycleContext = createContext();

export function ContentElementLifecycleProvider({type, children}) {
  const {lifecycle} = api.contentElementTypes.getOptions(type);

  if (lifecycle) {
    return (
      <RefBasedLifecycleProvider>
        {children}
      </RefBasedLifecycleProvider>
    );
  }
  else {
    return children;
  }
}

function RefBasedLifecycleProvider({children}) {
  const ref = useRef();
  const isPrepared = useOnScreen(ref, '25% 0px 25% 0px');
  const isActive = useOnScreen(ref, '-50% 0px -50% 0px');

  const value = useMemo(() => ({isPrepared, isActive}),
                        [isPrepared, isActive]);

  return (
    <div ref={ref}>
      <LifecycleContext.Provider value={value}>
        {children}
      </LifecycleContext.Provider>
    </div>
  );
}

/**
 * Returns an object containing information about the scroll position
 * related lifecylce of the content element. Requires the `lifecycle`
 * option to be set to true in the `frontend.contentElements.register`
 * call for the content element's type.
 *
 * * `isPrepared is true if the content element is near the viewport.
 *
 * * `isActive` is true if the content element is completely in the
 *   viewport.
 *
 * @example
 *
 * const {isActive, isPrepared} = useContentElementLifecycle();
 */
export function useContentElementLifecycle() {
  const result = useContext(LifecycleContext);

  if (!result) {
    throw new Error('useContentElementLifecycle is only available in ' +
                    'content elements for which `lifecycle: true` has ' +
                    'been passed to frontend.contentElements.register');
  }

  return result;
}
