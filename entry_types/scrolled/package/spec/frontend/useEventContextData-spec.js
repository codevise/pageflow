import React from 'react';

import {useEntryStructure} from 'entryState';
import {useEventContextData, EventContextDataProvider} from 'frontend/useEventContextData';

import {renderHookInEntry} from 'support';

describe('useEventContextData', () => {
  it('returns an object providing tracking information about current section and chapter', () => {
    const {result} = renderHookInEntry(() => useEventContextData(), {
      seed: {
        chapters: [
          {id: 1, configuration: {title: 'Intro'}},
          {id: 2, configuration: {title: 'Main part'}}
        ],
        sections: [
          {chapterId: 1},
          {chapterId: 1},
          {chapterId: 2},
          {chapterId: 2},
          {chapterId: 2}
        ]
      },
      wrapper: function Wrapper({children}) {
        const chapters = useEntryStructure();

        return (
          <EventContextDataProvider section={chapters[1].sections[2]}
                                    sectionsCount={10}>
            {children}
          </EventContextDataProvider>
        );
      }
    });

    expect(result.current).toMatchObject({
      page: {
        index: 4,

        configuration: {
          title: 'Main part, Section 4'
        }
      }
    });
    expect(result.current.page.getAnalyticsData()).toMatchObject({
      chapterIndex: 1,
      chapterTitle: 'Main part',

      index: 4,
      total: 10,
    });
  });
});
