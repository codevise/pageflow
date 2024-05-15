import React, {useEffect, useState} from 'react';
import BackboneEvents from 'backbone-events-standalone';
import {act} from '@testing-library/react'

import {renderInEntry} from './rendering';
import {ContentElementLifecycleContext} from 'pageflow-scrolled/frontend';

/**
 * Takes the same options as {@link renderInEntry} but returns
 * additional helper function to the return value of the
 * {@link `useContentElementLifecycle`} hook:
 *
 *     const {simulateScrollPosition} = renderInEntry(...)
 *     simulateScrollPosition('near viewport')
 *     // => Turns `shouldLoad` and `shouldPrepare` to true
 */
export function renderInEntryWithContentElementLifecycle(ui, options) {
  return renderInEntryWithScrollPositionLifecycle(
    ui,
    {lifecycleContext: ContentElementLifecycleContext, ...options}
  );
}

export function renderInEntryWithScrollPositionLifecycle(ui, {lifecycleContext, wrapper, ...options} = {}) {
  const emitter = createEmitter();

  return withSimulateScrollPositionHelper(
    emitter,
    renderInEntry(ui, {
      wrapper: createScrollPositionProvider(lifecycleContext,
                                            emitter,
                                            wrapper),
      ...options
    })
  );
}

function createScrollPositionProvider(Context, emitter, originalWrapper) {
  const OriginalWrapper = originalWrapper ||
                          function Noop({children}) { return children; };

  return function ScrollPositionProvider({children}) {
    const [value, setValue] = useState({shouldLoad: false, shouldPrepare: false, isVisible: false, isActive: false});

    useEffect(() => {
      function handle(scrollPosition) {
        switch (scrollPosition) {
        case 'near viewport':
          setValue({shouldLoad: true, shouldPrepare: true, isVisible: false, isActive: false});
          break;
        case 'in viewport':
          setValue({shouldLoad: true, shouldPrepare: true, isVisible: true, isActive: false});
          break;
        case 'center of viewport':
          setValue({shouldLoad: true, shouldPrepare: true, isVisible: true, isActive: true});
          break;
        default:
          setValue({isVisible: false, isActive: false});
          break;
        }
      }

      emitter.on('scroll', handle);

      return () => emitter.off('scroll', handle);
    })

    return (
      <OriginalWrapper>
        <Context.Provider value={value}>
          {children}
        </Context.Provider>
      </OriginalWrapper>
    );
  };
}

const allowedScrollPositions = ['outside viewport', 'near viewport', 'in viewport', 'center of viewport'];

function withSimulateScrollPositionHelper(emitter, result) {
  return {
    ...result,

    simulateScrollPosition(scrollPosition) {
      if (!allowedScrollPositions.includes(scrollPosition)) {
        throw new Error(`Invalid scrollPosition '${scrollPosition}'. ` +
                        `Allowed values: ${allowedScrollPositions.join(', ')}`)
      }

      act(() => {
        emitter.trigger('scroll', scrollPosition)
      });
    }
  }
}

function createEmitter() {
  return {...BackboneEvents};
}
