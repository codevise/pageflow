import React, {createContext, useContext, useMemo} from 'react';

import {useEntryStructureWithContentElements} from 'pageflow-scrolled/entryState';

import {review} from './api';
import {useCommentThreads} from './ReviewStateProvider';
import {sortByRange} from './sortByRange';

const EMPTY = {chapters: [], threads: [], bySubject: new Map()};

const LocatedCommentThreadsContext = createContext(EMPTY);

// Computes the located threads once and shares them through context. The
// navigator, the toolbar and the many per-section decorators all read the
// same result instead of each re-running the (entry structure × threads)
// join.
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

// Joins the review state's threads with the entry structure. Each section
// and content element carries its threads in final display order; threads
// whose content element was deleted ("orphans", matched via the persisted
// `sectionPermaId`) lead their section flagged with `orphaned`, and orphans
// whose section is gone too lead the first section so they stay reachable.
// Also returns a flat document-order `threads` list and a `bySubject` index
// keyed by `${subjectType}:${subjectId}` for useLocatedCommentThreadsForSubject.
function useComputeLocatedCommentThreads() {
  const structure = useEntryStructureWithContentElements();
  const allThreads = useCommentThreads();

  return useMemo(() => {
    const threadsBySubject = groupBySubject(allThreads);
    const threadsBySection = groupBySection(allThreads);

    // Placing a thread on its (live) subject removes it from its section
    // bucket; whatever remains once every subject is visited are orphans.
    const take = (subjectType, subjectId, compareRanges) => {
      const subjectThreads = sortByRange(
        threadsBySubject[subjectKey(subjectType, subjectId)] || [],
        compareRanges
      );
      subjectThreads.forEach(thread =>
        threadsBySection.get(thread.sectionPermaId)?.delete(thread)
      );
      return subjectThreads;
    };

    const chapters = [...structure.main, ...structure.excursions].map(chapter => ({
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

    // The section buckets now hold only orphans. Lead each section with its
    // own orphans; orphans whose section is gone too lead the first section
    // so they surface at the top of the list instead of vanishing.
    chapters.forEach(chapter =>
      chapter.sections.forEach(section => {
        section.threads = [...drainSection(threadsBySection, section.permaId),
                           ...section.threads];
      })
    );

    const firstSection = chapters[0]?.sections[0];
    const homelessOrphans = [...threadsBySection.values()]
      .flatMap(set => [...set])
      .map(markOrphan);

    if (firstSection && homelessOrphans.length > 0) {
      firstSection.threads = [...homelessOrphans, ...firstSection.threads];
    }

    chapters.forEach(chapter => {
      chapter.threadCount = countThreads(chapter.sections);
    });

    return {
      chapters,
      threads: flatten(chapters),
      bySubject: buildSubjectIndex(chapters)
    };
  }, [structure, allThreads]);
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
