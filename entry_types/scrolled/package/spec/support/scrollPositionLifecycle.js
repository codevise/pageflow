import React, {useEffect, useState} from 'react';
import BackboneEvents from 'backbone-events-standalone';
import {act} from '@testing-library/react'

import {renderInEntry} from './rendering';
import {SectionLifecycleContext} from 'frontend/useSectionLifecycle';
import {isActiveProbe} from 'frontend/useScrollPositionLifecycle.module.css';

export function findIsActiveProbe(el) {
  return findProbe(el, isActiveProbe);
}

// For now the element itself is used as probe. We keep this helper to
// make changes easy if we should decide to use a separate element again
// to work around restrictions regarding positive root margins in iframes.
export function findIsPreparedProbe(el) {
  return el;
}

function findProbe(el, className) {
  while (el) {
    let probe = el.querySelector(`.${className}`);

    if (probe) {
      return probe;
    }

    el = el.parentNode
  }
}

export function renderInEntryWithSectionLifecycle(ui, options = {}) {
  const emitter = createEmitter();

  return withSimulateScrollPositionHelper(
    emitter,
    renderInEntry(ui, {
      wrapper: createScrollPositionProvider(SectionLifecycleContext, emitter),
      ...options
    })
  );
}

function createScrollPositionProvider(Context, emitter) {
  return function ScrollPositionProvider({children}) {
    const [value, setValue] = useState({isPrepared: false, isVisible: false, isActive: false});

    useEffect(() => {
      function handle(scrollPosition) {
        switch (scrollPosition) {
        case 'near viewport':
          setValue({isPrepared: true, isVisible: false, isActive: false});
          break;
        case 'in viewport':
          setValue({isPrepared: true, isVisible: true, isActive: false});
          break;
        case 'center of viewport':
          setValue({isPrepared: true, isVisible: true, isActive: true});
          break;
        default:
          setValue({isPrepared: false, isVisible: false, isActive: false});
          break;
        }
      }

      emitter.on('scroll', handle);

      return () => emitter.off('scroll', handle);
    })

    return (
      <Context.Provider value={value}>
        {children}
      </Context.Provider>
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
