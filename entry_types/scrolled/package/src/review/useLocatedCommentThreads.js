import React, {createContext, useContext, useMemo} from 'react';

import {useEntryStructureWithContentElements} from 'pageflow-scrolled/entryState';

import {review} from './api';
import {useCommentThreads} from './ReviewStateProvider';
import {sortByRange} from './sortByRange';

const EMPTY = {chapters: [], threads: [], bySubject: new Map()};

const LocatedCommentThreadsContext = createContext(EMPTY);

export function LocatedCommentThreadsProvider({children}) {
  const located = useComputeLocatedCommentThreads();

  return (
    <LocatedCommentThreadsContext.Provider value={located}>
      {children}
    </LocatedCommentThreadsContext.Provider>
  );
}

/**
 * @private
 */
export function useLocatedCommentThreads() {
  return useContext(LocatedCommentThreadsContext);
}

function useComputeLocatedCommentThreads() {
  const structure = useEntryStructureWithContentElements();
  const allThreads = useCommentThreads();

  return useMemo(
    () => locateThreads(structure, allThreads),
    [structure, allThreads]
  );
}

function locateThreads(structure, allThreads) {
  const threadsBySection = groupBySection(allThreads);

  const chapters = placeThreadsOnSubjects(structure,
                                          groupBySubject(allThreads),
                                          threadsBySection);

  prependOrphans(chapters, threadsBySection);

  chapters.forEach(chapter => {
    chapter.threadCount = countThreads(chapter.sections);
  });

  return {
    chapters,
    threads: flatten(chapters),
    bySubject: buildSubjectIndex(chapters)
  };
}

function placeThreadsOnSubjects(structure, threadsBySubject, threadsBySection) {
  function take(subjectType, subjectId, compareRanges) {
    const subjectThreads = sortByRange(
      threadsBySubject[subjectKey(subjectType, subjectId)] || [],
      compareRanges
    );
    subjectThreads.forEach(thread =>
      threadsBySection.get(thread.sectionPermaId)?.delete(thread)
    );
    return subjectThreads;
  }

  return [...structure.main, ...structure.excursions].map(chapter => ({
    ...chapter,
    sections: chapter.sections.map(section => ({
      ...section,
      threads: take('Section', section.permaId),
      contentElements: section.contentElements.map(contentElement => ({
        ...contentElement,
        threads: take(
          'ContentElement',
          contentElement.permaId,
          review.contentElementTypes.findCompareRanges(contentElement.type)
        )
      }))
    }))
  }));
}

function prependOrphans(chapters, threadsBySection) {
  chapters.forEach(chapter =>
    chapter.sections.forEach(section => {
      section.threads = [...drainSection(threadsBySection, section.permaId),
                         ...section.threads];
    })
  );

  prependHomelessOrphans(chapters, threadsBySection);
}

function prependHomelessOrphans(chapters, threadsBySection) {
  const firstSection = chapters[0]?.sections[0];
  const homelessOrphans = [...threadsBySection.values()]
    .flatMap(set => [...set])
    .map(markOrphan);

  if (firstSection && homelessOrphans.length > 0) {
    firstSection.threads = [...homelessOrphans, ...firstSection.threads];
  }
}

function drainSection(threadsBySection, sectionPermaId) {
  const orphans = threadsBySection.get(sectionPermaId);
  threadsBySection.delete(sectionPermaId);
  return orphans ? [...orphans].map(markOrphan) : [];
}

function markOrphan(thread) {
  return {...thread, orphaned: true};
}

function flatten(chapters) {
  const threads = [];

  chapters.forEach(chapter =>
    chapter.sections.forEach(section => {
      threads.push(...section.threads);
      section.contentElements.forEach(contentElement =>
        threads.push(...contentElement.threads)
      );
    })
  );

  return threads;
}

function buildSubjectIndex(chapters) {
  const bySubject = new Map();

  chapters.forEach(chapter =>
    chapter.sections.forEach(section => {
      bySubject.set(subjectKey('Section', section.permaId), section.threads);
      section.contentElements.forEach(contentElement =>
        bySubject.set(subjectKey('ContentElement', contentElement.permaId),
                      contentElement.threads)
      );
    })
  );

  return bySubject;
}

function countThreads(sections) {
  return sections.reduce(
    (count, section) =>
      count +
      section.threads.length +
      section.contentElements.reduce((sum, element) => sum + element.threads.length, 0),
    0
  );
}

function groupBySubject(threads) {
  const result = {};

  threads.forEach(thread => {
    const key = subjectKey(thread.subjectType, thread.subjectId);
    (result[key] || (result[key] = [])).push(thread);
  });

  return result;
}

function groupBySection(threads) {
  const result = new Map();

  threads.forEach(thread => {
    if (!result.has(thread.sectionPermaId)) {
      result.set(thread.sectionPermaId, new Set());
    }
    result.get(thread.sectionPermaId).add(thread);
  });

  return result;
}

function subjectKey(subjectType, subjectId) {
  return `${subjectType}:${subjectId}`;
}
