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
  const mainStoryline = useMainStoryline();
  const chapters = useChapters();
  const sections = useEntryStateCollectionItems('sections');

  return useMemo(() => {
    const enrichedSections = sections.map(section => sectionData(section));

    const main = [];
    const excursions = [];

    chapters.forEach(chapter => {
      const chapterSections = enrichedSections.filter(
        item => item.chapterId === chapter.id
      );

      chapterSections.forEach(section =>
        section.chapter = chapter
      );

      chapter = {
        ...chapter,
        sections: chapterSections
      };

      if (chapter.storylineId === mainStoryline.id) {
        main.push(chapter);
      }
      else {
        excursions.push(chapter);
      }
    });

    linkAndIndexSections(main.flatMap(chapter => chapter.sections));
    excursions.forEach(excursion => linkAndIndexSections(excursion.sections));

    return {
      main,
      excursions
    }
  }, [mainStoryline, chapters, sections]);
};

function linkAndIndexSections(sections) {
  sections.forEach((section, index) => {
    section.sectionIndex = index;
    section.previousSection = sections[index - 1];
    section.nextSection = sections[index + 1];
  });
}

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
    ...normalizeSectionConfigurationData(section.configuration)
  };
}

export function normalizeSectionConfigurationData(configuration) {
  return {
    ...configuration,
    ...(configuration.backdropType === 'contentElement' ? {fullHeight: true} : {})
  };
}

export function useSectionForegroundContentElements({sectionId, layout, phoneLayout}) {
  const filter = useCallback(contentElement => (
    contentElement.sectionId === sectionId &&
    contentElement.configuration.position !== 'backdrop'
  ), [sectionId]);
  const contentElements = useEntryStateCollectionItems('contentElements', filter);

  return contentElements.map(contentElement =>
    contentElementData(contentElement, layout, phoneLayout)
  );
}

export function useContentElement({permaId, layout}) {
  const contentElement = useEntryStateCollectionItem('contentElements', permaId);

  return useMemo(
    () => contentElement && contentElementData(contentElement, layout),
    [contentElement, layout]
  );
}

function contentElementData(contentElement, layout, phoneLayout) {
  const position = getPosition(contentElement, layout, phoneLayout);

  return {
    id: contentElement.id,
    permaId: contentElement.permaId,
    sectionId: contentElement.sectionId,
    type: contentElement.typeName,
    position,
    width: getWidth(contentElement, position, phoneLayout),
    standAlone: contentElement.configuration.position === 'standAlone',
    props: contentElement.configuration
  };
}

const supportedPositions = {
  center: ['inline', 'left', 'right'],
  centerRagged: ['inline', 'left', 'right'],
  left: ['inline', 'side', 'sticky'],
  right: ['inline', 'side', 'sticky'],
  backdrop: ['backdrop']
};

function getPosition(contentElement, layout, phoneLayout) {
  const position = contentElement.configuration.position;

  if (contentElement.configuration.fullWidthInPhoneLayout && phoneLayout) {
    return 'inline';
  }

  return supportedPositions[layout || 'left'].includes(position) ?
         position :
         'inline';
}

const legacyPositionWidths = {
  wide: 2,
  full: 3
};

const clampedWidthPositions = ['sticky', 'left', 'right'];

function getWidth(contentElement, position, phoneLayout) {
  const width = typeof contentElement.configuration.width === 'number' ?
                contentElement.configuration.width :
                legacyPositionWidths[contentElement.configuration.position] || 0;

  if (contentElement.configuration.fullWidthInPhoneLayout && phoneLayout) {
    return 3;
  }
  else if (clampedWidthPositions.includes(position)) {
    return Math.min(Math.max(width || 0, -2), 2);
  }
  else {
    return width;
  }
}

export function useChapter({permaId}) {
  const chapters = useChapters();

  return useMemo(() =>
    chapters.find(chapter => chapter.permaId === permaId)
  , [chapters, permaId]);
};

export function useChapters() {
  const chapters = useEntryStateCollectionItems('chapters');

  return useMemo(() => {
    const chapterSlugs = {};

    return chapters.map((chapter, index) => {
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
        storylineId: chapter.storylineId,
        chapterSlug,
        index,
        ...chapter.configuration
      });
    });
  }, [chapters]);
}

export function useMainChapters() {
  const chapters = useChapters();
  const mainStoryline = useMainStoryline();

  return useMemo(
    () => chapters.filter(chapter => chapter.storylineId === mainStoryline.id),
    [chapters, mainStoryline]
  );
};

function useMainStoryline() {
  const storylines = useEntryStateCollectionItems('storylines');

  return useMemo(
    () => storylines.find(storyline => storyline.configuration.main),
    [storylines]
  );
}
