import {useLocatedCommentThreads} from 'review/useLocatedCommentThreads';
import {review} from 'review/api';

import {renderHookWithReviewState} from 'support/renderWithReviewState';

const storylinesSeed = [
  {id: 1, permaId: 10, position: 1, configuration: {main: true}},
  {id: 2, permaId: 11, position: 2, configuration: {}}
];
const chaptersSeed = [
  {id: 1, permaId: 100, storylineId: 1, position: 1, configuration: {title: 'Main chapter'}},
  {id: 2, permaId: 200, storylineId: 2, position: 1, configuration: {title: 'Excursion chapter'}}
];
const sectionsSeed = [
  {id: 1, permaId: 1000, chapterId: 1, position: 1},
  {id: 2, permaId: 2000, chapterId: 2, position: 1}
];
const contentElementsSeed = [
  {id: 1, permaId: 10001, sectionId: 1, typeName: 'textBlock'},
  {id: 2, permaId: 10002, sectionId: 1, typeName: 'image'},
  {id: 3, permaId: 20001, sectionId: 2, typeName: 'image'}
];

function renderLocatedCommentThreads(commentThreads) {
  return renderHookWithReviewState(() => useLocatedCommentThreads(), {
    seed: {
      storylines: storylinesSeed,
      chapters: chaptersSeed,
      sections: sectionsSeed,
      contentElements: contentElementsSeed
    },
    commentThreads
  });
}

describe('useLocatedCommentThreads', () => {
  it('attaches threads to their content element and section', () => {
    const {result} = renderLocatedCommentThreads([
      {id: 1, subjectType: 'ContentElement', subjectId: 10001, comments: []},
      {id: 2, subjectType: 'Section', subjectId: 1000, comments: []}
    ]);

    const section = result.current.chapters[0].sections[0];

    expect(section.threads.map(t => t.id)).toEqual([2]);
    expect(section.contentElements[0].threads.map(t => t.id)).toEqual([1]);
    expect(section.contentElements[1].threads).toEqual([]);
  });

  it('places threads by subject without needing a sectionPermaId', () => {
    const {result} = renderLocatedCommentThreads([
      {id: 1, subjectType: 'ContentElement', subjectId: 10001, comments: []}
    ]);

    const section = result.current.chapters[0].sections[0];

    expect(section.contentElements[0].threads.map(t => t.id)).toEqual([1]);
    expect(section.orphanedThreads).toEqual([]);
    expect(result.current.orphanedThreads).toEqual([]);
  });

  it('orders chapters main first then excursions and includes excursion threads', () => {
    const {result} = renderLocatedCommentThreads([
      {id: 3, subjectType: 'ContentElement', subjectId: 20001, comments: []}
    ]);

    const chapters = result.current.chapters;

    expect(chapters.map(c => c.title)).toEqual(['Main chapter', 'Excursion chapter']);
    expect(chapters[0].isExcursion).toBe(false);
    expect(chapters[1].isExcursion).toBe(true);
    expect(chapters[1].sections[0].contentElements[0].threads.map(t => t.id)).toEqual([3]);
  });

  it('counts all threads of a chapter', () => {
    const {result} = renderLocatedCommentThreads([
      {id: 1, subjectType: 'ContentElement', subjectId: 10001, comments: []},
      {id: 2, subjectType: 'Section', subjectId: 1000, comments: []},
      {id: 3, subjectType: 'ContentElement', subjectId: 20001, comments: []}
    ]);

    expect(result.current.chapters[0].threadCount).toBe(2);
    expect(result.current.chapters[1].threadCount).toBe(1);
  });

  it("orders a content element's threads by the type's compareRanges", () => {
    review.contentElementTypes.register('textBlock', {
      compareRanges: (a, b) => a - b
    });

    const {result} = renderLocatedCommentThreads([
      {id: 1, subjectType: 'ContentElement', subjectId: 10001, subjectRange: 2, comments: []},
      {id: 2, subjectType: 'ContentElement', subjectId: 10001, subjectRange: 1, comments: []}
    ]);

    const element = result.current.chapters[0].sections[0].contentElements[0];

    expect(element.threads.map(t => t.id)).toEqual([2, 1]);
    expect(result.current.threads.map(t => t.id)).toEqual([2, 1]);

    review.contentElementTypes.types = {};
  });

  it('provides a flat list of threads in document order, section before its elements', () => {
    const {result} = renderLocatedCommentThreads([
      {id: 1, subjectType: 'ContentElement', subjectId: 10001, comments: []},
      {id: 2, subjectType: 'Section', subjectId: 1000, comments: []},
      {id: 3, subjectType: 'ContentElement', subjectId: 20001, comments: []}
    ]);

    expect(result.current.threads.map(t => t.id)).toEqual([2, 1, 3]);
  });

  it('relocates a thread whose content element was deleted to its section', () => {
    const {result} = renderLocatedCommentThreads([
      {id: 4, subjectType: 'ContentElement', subjectId: 99999,
       sectionPermaId: 1000, comments: []}
    ]);

    const section = result.current.chapters[0].sections[0];

    expect(section.orphanedThreads.map(t => t.id)).toEqual([4]);
    expect(result.current.orphanedThreads).toEqual([]);
  });

  it('keeps threads whose section no longer exists in the top-level orphans', () => {
    const {result} = renderLocatedCommentThreads([
      {id: 1, subjectType: 'ContentElement', subjectId: 10001, comments: []},
      {id: 4, subjectType: 'ContentElement', subjectId: 99999, sectionPermaId: 88888, comments: []}
    ]);

    expect(result.current.chapters[0].sections[0].orphanedThreads).toEqual([]);
    expect(result.current.orphanedThreads.map(t => t.id)).toEqual([4]);
    expect(result.current.threads.map(t => t.id)).toEqual([1]);
  });

  it('leaves orphanedThreads empty on sections without orphaned threads', () => {
    const {result} = renderLocatedCommentThreads([
      {id: 2, subjectType: 'Section', subjectId: 1000, comments: []}
    ]);

    result.current.chapters.forEach(chapter =>
      chapter.sections.forEach(section =>
        expect(section.orphanedThreads).toEqual([])
      )
    );
  });

  it('attaches resolved threads as well', () => {
    const {result} = renderLocatedCommentThreads([
      {id: 5, subjectType: 'ContentElement', subjectId: 10002,
       resolvedAt: '2026-04-09', comments: []}
    ]);

    const section = result.current.chapters[0].sections[0];

    expect(section.contentElements[1].threads.map(t => t.id)).toEqual([5]);
  });
});
