import {useCurrentChapter, useCurrentSectionIndexState} from 'frontend/useCurrentChapter';

import {renderHookInEntry} from 'support';
import {act} from '@testing-library/react';

describe('useCurrentChapter', () => {
  it('returns first chapter initially', () => {
    const {result} = renderHookInEntry(() => useCurrentChapter(), {
      seed: {
        chapters: [{id: 5, permaId: 50, configuration: {title: 'Intro'}}],
        sections: [{chapterId: 5}]
      }
    });

    expect(result.current).toMatchObject({permaId: 50, title: 'Intro', chapterSlug: 'intro'})
  });

  it('returns chapter of last section passed to useUpdateCurrentSectionIndex function', () => {
    let setCurrentSectionIndex;

    const {result} = renderHookInEntry(() => {
      [,setCurrentSectionIndex] = useCurrentSectionIndexState();
      return useCurrentChapter()
    }, {
      seed: {
        chapters: [
          {id: 5, permaId: 50, configuration: {title: 'Intro'}},
          {id: 6, permaId: 60, configuration: {title: 'Main Part'}}
        ],
        sections: [
          {chapterId: 5},
          {chapterId: 6}
        ]
      }
    });

    act(() => setCurrentSectionIndex(1));

    expect(result.current).toMatchObject({permaId: 60, title: 'Main Part', chapterSlug: 'main-part'})
  });
});
