import React, {useEffect} from 'react';
import {render} from '@testing-library/react';
import {renderHook} from '@testing-library/react-hooks';

import {RootProviders} from 'frontend';
import {useEntryStateDispatch} from 'entryState';
import {normalizeSeed} from './normalizeSeed';
import {Consent} from 'pageflow/frontend';

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
 * To be able to render components that expect the result of certain
 * hooks as part of their props, instead of a React component, you can
 * pass a function returning a React component as first parameter. The
 * function will be evaluated in a context of a React component and
 * can thus make use of hooks
 *
 *     // DOES NOT WORK
 *     renderInEntry(<Image file={useFile({collectionName: 'imageFiles', permaId: 4})} />, {seed});
 *
 *     // WORKS
 *     renderInEntry(() => <Image file={useFile({collectionName: 'imageFiles', permaId: 4})} />, {seed});
 *
 * When using the `rerender` function from the result, you again need
 * to use the same type of parameter you passed to the original
 * `renderInEntry` call.
 *
 * @param {React.Component|Function} ui - React component or function returning a React component
 * @param {Object} [options]
 * @param {Object} [options.seed] - Seed data for entry state. Passed through {@link normalizeSeed}.
 * @param {Function} [options.setup] -
 *   Function that gets called with the internal entry state dispatch
 *   function. The normalized seed constructed from the `seed` option
 *   is passed as a second parameter.
 */
export function renderInEntry(ui, {
  seed, setup, wrapper, consent = Consent.create(), ...options
} = {}) {
  options = {
    wrapper: createWrapper(seed, setup, wrapper, consent),
    ...options
  };

  if (typeof ui === 'function') {
    // Evaluate `ui` inside a React component to allow using hooks in
    // the test. We also could have used `ui` as a React component
    // directly (e.g. `React.createElement(ui)`). But when calling
    // `rerender` with a different function than the one passed to the
    // original `renderInEntry` call, e.g.
    //
    //   const {rerender} = renderInEntry(() => <MyComponent someProp={1} />);
    //   rerender(() => <MyComponent someProp={2} />);
    //
    // React would unmount the `MyComponent` component from the first
    // render call and mount a new one. We therefore define a single
    // component that is reused across rerenders to ensure
    // `MyComponent` stays mounted and just receives new props.
    function HooksWrapper({ui}) {
      return ui();
    }

    const result = render(<HooksWrapper ui={ui} />, options)

    return {
      ...result,
      rerender(ui) {
        result.rerender(<HooksWrapper ui={ui} />)
      }
    };
  }
  else {
    return render(ui, options);
  }
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

function createWrapper(seed, setup, originalWrapper, consent) {
  const normalizedSeed = normalizeSeed(seed);
  const OriginalWrapper = originalWrapper || function Noop({children}) { return children; };

  return function Wrapper({children}) {
    return (
      <RootProviders seed={normalizedSeed} consent={consent}>
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
