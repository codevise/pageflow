import {useMemo, useCallback} from 'react';
import {useEntryStateCollectionItems, useEntryStateCollectionItem} from './EntryStateProvider';
import slugify from 'slugify';

/**
 * Returns a nested data structure representing the chapters and sections
 * of the entry.
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
 *           // references to parent chapter
 *           chapter: { ... },
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
  const chapters = useChapters();
  const sections = useEntryStateCollectionItems('sections');

  return useMemo(() => {
    const linkedSections = sections.map(section => sectionData(section));

    linkedSections.forEach((section, index) => {
      section.sectionIndex = index;
      section.previousSection = linkedSections[index - 1];
      section.nextSection = linkedSections[index + 1];
    });
    return chapters.map(chapter => {
      const chapterSections = linkedSections.filter(
        item => item.chapterId === chapter.id
      );

      chapterSections.forEach(section =>
        section.chapter = chapter
      );

      return {
        ...chapter,
        sections: chapterSections
      };
    });
  }, [chapters, sections]);
};

/**
 * Returns an array of sections each with a chapter property containing
 * data about the parent chapter.
 *
 * @private
 *
 * @example
 *
 * const sections = useSectionsWithChapter();
 * sections // =>
 *   [
 *     {
 *       id: 1,
 *       permaId: 101,
 *       chapterId: 3,
 *       transition: 'scroll',
 *       chapter: {
 *         id: 3,
 *         permaId: 5,
 *         title: 'Chapter 1',
 *         summary: 'An introductory chapter',
 *         chapterSlug: 'chapter-1'
 *       },
 *     }
 *   ]
 */
export function useSectionsWithChapter() {
  const chapters = useChapters();
  const sections = useEntryStateCollectionItems('sections');

  const chaptersById = useMemo(() => chapters.reduce((result, chapter) => {
    result[chapter.id] = chapter;
    return result;
  }, {}), [chapters]);

  return useMemo(() => {
    return sections.map((section, sectionIndex) => ({
      sectionIndex,
      ...sectionData(section),
      chapter: chaptersById[section.chapterId]
    }));
  }, [chaptersById, sections]);
}

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

  return useMemo(() => {
    const chapterSlugs = {};

    return chapters.map(chapter => {
      let chapterSlug = chapter.configuration.title;

      if (chapterSlug) {
        chapterSlug = slugify(chapterSlug, {
          lower: true,
          locale: 'de',
          strict: true
        });

        if (chapterSlugs[chapterSlug]) {
          chapterSlug = chapterSlug+'-'+chapter.permaId; //append permaId if chapter reference is not unique
        }

        chapterSlugs[chapterSlug] = chapter;
      }
      else{
        chapterSlug = 'chapter-'+chapter.permaId;
      }

      return ({
        id: chapter.id,
        permaId: chapter.permaId,
        title: chapter.configuration.title,
        summary: chapter.configuration.summary,
        chapterSlug: chapterSlug
      });
    });
  }, [chapters]);
}
