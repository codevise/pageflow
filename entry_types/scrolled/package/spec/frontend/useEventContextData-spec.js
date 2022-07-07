import React from 'react';

import {useEventContextData, EventContextDataProvider} from 'frontend/useEventContextData';

import {renderHookInEntry} from 'support';

describe('useEventContextData', () => {
  it('returns an object with current section and chapter index', () => {
    const section = {
      sectionIndex: 0,
      chapter: {
        title: 'Chapter 1'
      }
    };
    const {result} = renderHookInEntry(() => useEventContextData(), {
      wrapper: ({children}) =>
        <EventContextDataProvider section={section}>{children}</EventContextDataProvider>
    });

    expect(result.current).toMatchObject({
      page: {
        configuration: {
          title: 'Chapter 1, Section 0'
        },
        index: 0
      }
    });
  });
});
