import {useMemo, useCallback} from 'react';
import {useEntryStateCollectionItems, useEntryStateCollectionItem} from './EntryStateProvider';

/**
 * Returns a nested data structure representing the chapters, sections
 * and content elements of the entry.
 *
 * @private
 *
 * @example
 *
 * const structure = useEntryStructure();
 * structure // =>
 *   [
 *     {
 *       permaId: 5,
 *       title: 'Chapter 1',
 *       summary: 'An introductory chapter',
 *       sections: [
 *         {
 *           id: 1,
 *           permaId: 101,
 *           chapterId: 3,
 *           sectionIndex: 0,
 *           transition: 'scroll',
 *
 *           // references to adjacent section objects
 *           previousSection: { ... },
 *           nextSection: { ... },
 *         }
 *       ],
 *     }
 *   ]
 */
export function useEntryStructure() {
  const chapters = useEntryStateCollectionItems('chapters');
  const sections = useEntryStateCollectionItems('sections');

  return useMemo(() => {
    const linkedSections = sections.map(section => sectionData(section));

    linkedSections.forEach((section, index) => {
      section.sectionIndex = index;
      section.previousSection = linkedSections[index - 1];
      section.nextSection = linkedSections[index + 1];
    });

    return chapters.map(chapter => ({
      permaId: chapter.permaId,
      ...chapter.configuration,
      sections: linkedSections.filter(
        item => item.chapterId === chapter.id
      )
    }));
  }, [chapters, sections]);
};

/**
 * Returns a nested data structure representing the content elements
 * of section.
 *
 * @param {Object} options
 * @param {number} options.sectionPermaId
 *
 * @private
 *
 * @example
 *
 * const section = useSection({sectionPermaId: 4});
 * section // =>
 *   {
 *     id: 100,
 *     permaId: 4,
 *     chapterId: 1,
 *     transition: 'scroll'
 *   }
 */
export function useSection({sectionPermaId}) {
  const section = useEntryStateCollectionItem('sections', sectionPermaId);
  return sectionData(section);
};

function sectionData(section) {
  return section && {
    permaId: section.permaId,
    id: section.id,
    chapterId: section.chapterId,
    ...section.configuration
  };
}

export function useSectionContentElements({sectionId}) {
  const filterBySectionId = useCallback(contentElement => contentElement.sectionId === sectionId,
                                        [sectionId])
  const contentElements = useEntryStateCollectionItems('contentElements', filterBySectionId);

  return contentElements.map(item => ({
    id: item.id,
    permaId: item.permaId,
    type: item.typeName,
    position: item.configuration.position,
    props: item.configuration
  }));
}

export function useChapters() {
  const chapters = useEntryStateCollectionItems('chapters');

  return chapters.map(chapter => {
    return ({
      permaId: chapter.permaId,
      title: chapter.configuration.title,
      summary: chapter.configuration.summary
    });
  });
}
