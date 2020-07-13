import React from 'react';

import {useEventContextData, EventContextDataProvider} from 'frontend/useEventContextData';

import 'support/fakeBrowserFeatures';
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
      wrapper: ({children}) => ( <EventContextDataProvider sectionIndex={1}>{children}</EventContextDataProvider> )
    });
    
    expect(result.current).toMatchObject({
      configuration: {
        title: null
      },
      index: 1,
    });
    
  });

});
