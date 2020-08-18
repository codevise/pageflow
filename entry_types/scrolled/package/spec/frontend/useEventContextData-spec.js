import React from 'react';

import {useEventContextData, EventContextDataProvider} from 'frontend/useEventContextData';

import {renderHookInEntry} from 'support';

describe('useEventContextData', () => {
  it('returns an object with current section and chapter index', () => {
    const {result} = renderHookInEntry((props) => useEventContextData(), {
      seed: {
        entry: {
          locale: 'en'
        },
        sections: [
          {
            id: 1,
            permaId: 101,
            chapterId: 1,
            position: 1,
            configuration: {
              transition: 'scroll'
            }
          },
        ],
        chapters: [
          {
            id: 1,
            permaId: 10,
            position: 1,
            configuration: {
              title: 'Chapter 1',
              summary: 'An introductory chapter'
            }
          },
        ]
      },
      wrapper: ({children}) =>
        <EventContextDataProvider sectionIndex={0}>{children}</EventContextDataProvider>
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
