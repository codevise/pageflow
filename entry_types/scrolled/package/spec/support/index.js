import React from 'react';
import {render} from '@testing-library/react'

import {EntryStateProvider, useEntryState} from 'entryState';

export function renderInEntry(ui, {seed, ...options}) {
  return render(ui,
                {
                  wrapper: function Wrapper({children}) {
                    const [{entryState},] = useEntryState(normalizeSeed(seed));

                    return (
                      <EntryStateProvider state={entryState}>
                        {children}
                      </EntryStateProvider>
                    );
                  },
                  ...options
                })
}

function normalizeSeed({imageFiles, imageFileUrlTemplates} = {}) {
  return {
    config: {
      fileUrlTemplates: {
        imageFiles: {
          ...imageFileUrlTemplates
        }
      }
    },
    collections: {
      imageFiles: normalizeCollection(imageFiles, {
        width: 1920,
        height: 1279,
        configuration: {},
      }),
    }
  }
}

function normalizeCollection(collection = [], defaults) {
  return collection.map(item => ({
    ...defaults,
    ...item
  }));
}
