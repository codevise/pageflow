import {useMemo} from 'react';

import {useEntryStructureWithContentElements} from 'pageflow-scrolled/entryState';

import {review} from './api';
import {useCommentThreads} from './ReviewStateProvider';
import {sortByRange} from './sortByRange';

/**
 * Joins the comment threads from the review state with the entry
 * structure so both the editor sidebar and the preview navigator can
 * present threads grouped by their location in the entry.
 *
 * Threads are placed by their subject (a section or content element).
 * Threads whose content element has been deleted are kept in context by
 * their section's `orphanedThreads`, matched via the persisted
 * `sectionPermaId`; threads whose section is gone too end up in the
 * top-level `orphanedThreads`. Also returns a flat list of all located
 * threads in document order.
 *
 * @private
 */
export function useLocatedCommentThreads() {
  const structure = useEntryStructureWithContentElements();
  const allThreads = useCommentThreads();

  return useMemo(() => {
    const threadsBySubject = groupBySubject(allThreads);
    const threadsBySection = groupBySection(allThreads);
    const threads = [];

    // Placing a thread on its (live) subject removes it from its section
    // bucket. Whatever remains once every subject has been visited are
    // the threads whose subject is gone — a section's orphans.
    const take = (subjectType, subjectId, compareRanges) => {
      const subjectThreads = sortByRange(
        threadsBySubject[subjectKey(subjectType, subjectId)] || [],
        compareRanges
      );
      subjectThreads.forEach(thread =>
        threadsBySection.get(thread.sectionPermaId)?.delete(thread)
      );
      threads.push(...subjectThreads);
      return subjectThreads;
    };

    const locateChapter = chapter => {
      const sections = chapter.sections.map(section => ({
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
      }));

      return {...chapter, sections, threadCount: countThreads(sections)};
    };

    const chapters = [...structure.main, ...structure.excursions].map(locateChapter);

    // All subjects have been visited, so the section buckets now hold
    // only orphaned threads. Attach those whose section survives; the
    // rest stay globally orphaned.
    chapters.forEach(chapter =>
      chapter.sections.forEach(section => {
        section.orphanedThreads = drainSection(threadsBySection, section.permaId);
      })
    );

    const orphanedThreads = [...threadsBySection.values()].flatMap(set => [...set]);

    return {chapters, threads, orphanedThreads};
  }, [structure, allThreads]);
}

function drainSection(threadsBySection, sectionPermaId) {
  const orphans = threadsBySection.get(sectionPermaId);
  threadsBySection.delete(sectionPermaId);
  return orphans ? [...orphans] : [];
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
