import {useMemo} from 'react';

import {useEntryStructureWithContentElements} from 'pageflow-scrolled/entryState';

import {useCommentThreads} from './ReviewStateProvider';

/**
 * Joins the comment threads from the review state with the entry
 * structure so both the editor sidebar and the preview navigator can
 * present threads grouped by their location in the entry.
 *
 * Returns the chapters (main storyline first, excursions last) with
 * threads attached to the section or content element they belong to,
 * a flat list of all located threads in document order, and the
 * threads whose subject is no longer part of the entry.
 *
 * @private
 */
export function useLocatedCommentThreads() {
  const structure = useEntryStructureWithContentElements();
  const allThreads = useCommentThreads();

  return useMemo(() => {
    const threadsBySubject = groupBySubject(allThreads);
    const locatedThreads = new Set();
    const threads = [];

    const take = (subjectType, subjectId) => {
      const subjectThreads = threadsBySubject[subjectKey(subjectType, subjectId)] || [];
      subjectThreads.forEach(thread => locatedThreads.add(thread));
      threads.push(...subjectThreads);
      return subjectThreads;
    };

    const locateChapter = chapter => {
      const sections = chapter.sections.map(section => ({
        ...section,
        threads: take('Section', section.permaId),
        contentElements: section.contentElements.map(contentElement => ({
          ...contentElement,
          threads: take('ContentElement', contentElement.permaId)
        }))
      }));

      return {...chapter, sections, threadCount: countThreads(sections)};
    };

    const chapters = [...structure.main, ...structure.excursions].map(locateChapter);
    const orphanedThreads = allThreads.filter(thread => !locatedThreads.has(thread));

    return {chapters, threads, orphanedThreads};
  }, [structure, allThreads]);
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

function subjectKey(subjectType, subjectId) {
  return `${subjectType}:${subjectId}`;
}
