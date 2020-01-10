import React, {useEffect} from 'react';
import {render} from '@testing-library/react'
import {renderHook} from '@testing-library/react-hooks';

import {EntryStateProvider, useEntryStateDispatch} from 'entryState';

export function renderInEntry(ui, {seed, ...options}) {
  return render(ui,
                {
                  wrapper: createWrapper(seed),
                  ...options
                })
}

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
