import {useLocatedCommentThreadsForSubject} from 'review/useLocatedCommentThreadsForSubject';

import {renderHookWithReviewState} from 'support/renderWithReviewState';

const seed = {
  storylines: [{id: 1, permaId: 10, position: 1, configuration: {main: true}}],
  chapters: [{id: 1, permaId: 100, storylineId: 1, position: 1}],
  sections: [{id: 1, permaId: 1000, chapterId: 1, position: 1}],
  contentElements: [{id: 1, permaId: 10001, sectionId: 1, typeName: 'textBlock'}]
};

function renderForSubject(args, commentThreads) {
  return renderHookWithReviewState(() => useLocatedCommentThreadsForSubject(args), {
    seed,
    commentThreads
  });
}

describe('useLocatedCommentThreadsForSubject', () => {
  it('returns the threads of a content element', () => {
    const {result} = renderForSubject(
      {subjectType: 'ContentElement', subjectId: 10001},
      [
        {id: 1, subjectType: 'ContentElement', subjectId: 10001, comments: []},
        {id: 2, subjectType: 'Section', subjectId: 1000, comments: []}
      ]
    );

    expect(result.current.map(t => t.id)).toEqual([1]);
  });

  it('includes a section\'s orphaned threads, flagged and on top', () => {
    const {result} = renderForSubject(
      {subjectType: 'Section', subjectId: 1000},
      [
        {id: 2, subjectType: 'Section', subjectId: 1000, comments: []},
        {id: 4, subjectType: 'ContentElement', subjectId: 99999,
         sectionPermaId: 1000, comments: []}
      ]
    );

    expect(result.current.map(t => t.id)).toEqual([4, 2]);
    expect(result.current[0].orphaned).toBe(true);
  });

  it('filters by resolution', () => {
    const {result} = renderForSubject(
      {subjectType: 'ContentElement', subjectId: 10001, resolution: 'unresolved'},
      [
        {id: 1, subjectType: 'ContentElement', subjectId: 10001, resolvedAt: null, comments: []},
        {id: 2, subjectType: 'ContentElement', subjectId: 10001,
         resolvedAt: '2026-04-09T10:00:00Z', comments: []}
      ]
    );

    expect(result.current.map(t => t.id)).toEqual([1]);
  });

  it('filters by subjectRange when given', () => {
    const subjectRange = {anchor: {path: [0, 0], offset: 5}, focus: {path: [0, 0], offset: 12}};

    const {result} = renderForSubject(
      {subjectType: 'ContentElement', subjectId: 10001, subjectRange},
      [
        {id: 1, subjectType: 'ContentElement', subjectId: 10001, subjectRange, comments: []},
        {id: 2, subjectType: 'ContentElement', subjectId: 10001, comments: []}
      ]
    );

    expect(result.current.map(t => t.id)).toEqual([1]);
  });

  it('returns an empty list for an unknown subject', () => {
    const {result} = renderForSubject(
      {subjectType: 'ContentElement', subjectId: 99999},
      [{id: 1, subjectType: 'ContentElement', subjectId: 10001, comments: []}]
    );

    expect(result.current).toEqual([]);
  });
});
