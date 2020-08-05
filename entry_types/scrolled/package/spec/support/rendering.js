import React, {useEffect} from 'react';
import {render} from '@testing-library/react'
import {renderHook} from '@testing-library/react-hooks';

import {RootProviders} from 'frontend';
import {useEntryStateDispatch} from 'entryState';
import {normalizeSeed} from './normalizeSeed';

/**
 * Render a component that depends on entry state. Accepts all options
 * supported by [`render` of
 * `@testing-library/react`](https://testing-library.com/docs/react-testing-library/api#render).
 *
 * The `seed` option can be used to simulate rendering the component
 * in the published entry. Data passed in this option would normally
 * be rendered in a server side JBuilder template.
 *
 * The `setup` option can be used to simulate rendering the component
 * in the editor where data is synchronized from Backbone models.
 *
 * @param {React.Component} ui - React component
 * @param {Object} [options]
 * @param {Object} [options.seed] - Seed data for entry state. Passed through {@link normalizeSeed}.
 * @param {Function} [options.setup] -
 *   Function that gets called with the internal entry state dispatch
 *   function. The normalized seed constructed from the `seed` option
 *   is passed as a second parameter.
 */
export function renderInEntry(ui, {seed, setup, wrapper, ...options} = {}) {
  return render(ui,
                {
                  wrapper: createWrapper(seed, setup, wrapper),
                  ...options
                });
}

/**
 * Render a hook that depends on entry state.  Accepts all options
 * supported by [`renderHook` of
 * `@testing-library/react-hooks`](https://react-hooks-testing-library.com/reference/api)
 *
 * Can be used to test selector hooks which extract information from
 * the entry state.
 *
 * @param {Function} callback - Function that calls the hook.
 * @param {Object} [options]
 * @param {Object} [options.seed] - Seed data for entry state. Passed through {@link normalizeSeed}.
 * @param {Function} [options.setup] - See {@link renderInEntry}.
 */
export function renderHookInEntry(callback, {seed, setup, wrapper, ...options} = {}) {
  return renderHook(callback,
                    {
                      wrapper: createWrapper(seed, setup, wrapper),
                      ...options
                    });
}

function createWrapper(seed, setup, originalWrapper) {
  const normalizedSeed = normalizeSeed(seed);
  const OriginalWrapper = originalWrapper || function Noop({children}) { return children; };

  return function Wrapper({children}) {
    return (
      <RootProviders seed={normalizedSeed}>
        <Dispatcher callback={setup} seed={normalizedSeed}>
          <OriginalWrapper>
            {children}
          </OriginalWrapper>
        </Dispatcher>
      </RootProviders>
    );
  }
}

function Dispatcher({children, seed, callback}) {
  const dispatch = useEntryStateDispatch();

  useEffect(() => {
    if (callback) {
      callback(dispatch, seed);
    }
  }, [dispatch, seed, callback]);

  return children;
}
