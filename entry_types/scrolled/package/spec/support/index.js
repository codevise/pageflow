import React, {useEffect} from 'react';
import {render} from '@testing-library/react'
import {renderHook} from '@testing-library/react-hooks';

import {EntryStateProvider, useEntryStateDispatch} from 'entryState';

/**
 * Render a component that depends on entry state. Accepts all options
 * supported by [`render` of
 * `@testing-library/react`](https://testing-library.com/docs/react-testing-library/api#render).
 *
 * @param {React.Component} ui - React component
 * @param {Object} [options]
 * @param {Object} [options.seed] - Seed data for entry state.
 * @param {Object} [options.seed.imageFileUrlTemplates] - Mapping of url template names to url templates.
 * @param {Array} [options.seed.imageFiles] - Array of objects with image file attributes of entry.
 * @param {Array} [options.seed.chapters] - Array of objects with chapter attributes of entry.
 * @param {Array} [options.seed.sections] - Array of objects with section attributes of entry.
 * @param {Array} [options.seed.contentElements] - Array of objects with content element attributes of entry.
 * @param {Function} [options.setup] - Functions that gets called with the internal entry state dispatch function.
 */
export function renderInEntry(ui, {seed, setup, ...options}) {
  return render(ui,
                {
                  wrapper: createWrapper(seed, setup),
                  ...options
                })
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
 * @param {Object} options
 * @param {Object} [options.seed] - See {@link renderInEntry}.
 * @param {Function} [options.setup] - See {@link renderInEntry}.
 */
export function renderHookInEntry(callback, {seed, setup, ...options} = {}) {
  return renderHook(callback,
                    {
                      wrapper: createWrapper(seed, setup),
                      ...options
                    })
}

function createWrapper(seed, setup) {
  return function Wrapper({children}) {
    return (
      <EntryStateProvider seed={normalizeSeed(seed)}>
        <Dispatcher callback={setup}>
          {children}
        </Dispatcher>
      </EntryStateProvider>
    );
  }
}

function Dispatcher({children, callback}) {
  const dispatch = useEntryStateDispatch();

  useEffect(() => {
    if (callback) {
      callback(dispatch);
    }
  }, [dispatch, callback]);

  return children;
}

function normalizeSeed({
  imageFileUrlTemplates,
  fileUrlTemplates,
  imageFiles,
  chapters,
  sections,
  contentElements
} = {}) {
  return {
    config: {
      fileUrlTemplates: {
        imageFiles: {
          ...imageFileUrlTemplates
        },
        ...fileUrlTemplates
      }
    },
    collections: {
      imageFiles: normalizeCollection(imageFiles, {
        width: 1920,
        height: 1279,
        configuration: {},
      }),
      chapters: normalizeCollection(chapters),
      sections: normalizeCollection(sections),
      contentElements: normalizeCollection(contentElements),
    }
  }
}

function normalizeCollection(collection = [], defaults = {}) {
  return collection.map(item => ({
    ...defaults,
    ...item
  }));
}
