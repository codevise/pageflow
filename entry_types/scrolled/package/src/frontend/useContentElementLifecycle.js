import React, {createContext} from 'react';

import {
  createScrollPositionLifecycleProvider,
  createScrollPositionLifecycleHook,
} from './useScrollPositionLifecycle';

import {api} from './api';

const ContentElementLifecycleContext = createContext();

const LifecycleProvider = createScrollPositionLifecycleProvider(
  ContentElementLifecycleContext
);

const useLifecycle = createScrollPositionLifecycleHook(
  ContentElementLifecycleContext
);

export function ContentElementLifecycleProvider({type, children}) {
  const {lifecycle} = api.contentElementTypes.getOptions(type);

  if (lifecycle) {
    return (
      <LifecycleProvider>
        {children}
      </LifecycleProvider>
    );
  }
  else {
    return children;
  }
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
 * @param {Function} onActivate -
 *   Invoked when content element has entered the viewport.
 *
 * @param {Function} onDeactivate -
 *   Invoked when content element has left the viewport.
 *
 * @example
 *
 * const {isActive, isPrepared} = useContentElementLifecycle();
 */
export function useContentElementLifecycle(options) {
  const result = useLifecycle(options);

  if (!result) {
    throw new Error('useContentElementLifecycle is only available in ' +
                    'content elements for which `lifecycle: true` has ' +
                    'been passed to frontend.contentElements.register');
  }

  return result;
}
