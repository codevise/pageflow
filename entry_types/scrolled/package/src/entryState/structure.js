import {useMemo} from 'react';

import {useEntryState} from './EntryStateProvider';
import {getItems, getItem} from '../collections';

/**
 * Returns a nested data structure representing the chapters, sections
 * and content elements of the entry.
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
 *           permaId: 101,
 *           sectionIndex: 0,
 *           transition: 'scroll',
 *
 *           // references to adjacent section objects
 *           previousSection: { ... },
 *           nextSection: { ... },
 *
 *           foreground: [
 *             {
 *               type: 'heading',
 *               props: {
 *                 children: 'Heading'
 *               }
 *             },
 *             {
 *               type: 'textBlock',
 *               props: {
 *                 children: 'Some text'
 *               }
 *             }
 *           ]
 *         }
 *       ],
 *     }
 *   ]
 */
export function useEntryStructure() {
  const entryState = useEntryState();

  return useMemo(() => {
    const sections = [];

    const chapters = getItems(entryState.collections, 'chapters').map(chapter => ({
      permaId: chapter.permaId,
      ...chapter.configuration,
      sections: getItems(entryState.collections, 'sections')
        .filter(
          item => item.chapterId === chapter.id
        )
        .map(section => {
          const result = sectionStructure(entryState.collections, section);
          sections.push(result);
          return result;
        })
    }));

    sections.forEach((section, index) => {
      section.sectionIndex = index;
      section.previousSection = sections[index - 1];
      section.nextSection = sections[index + 1];
    });

    return chapters;
  }, [entryState]);
};


/**
 * Returns a nested data structure representing the content elements
 * of section.
 *
 * @param {Object} options
 * @param {number} options.sectionPermaId
 *
 * @example
 *
 * const section = useSectionStructure({sectionPermaId: 4});
 * section // =>
 *   {
 *     permaId: 4,
 *     transition: 'scroll',
 *     foreground: [
 *       {
 *         type: 'heading',
 *         props: {
 *           children: 'Heading'
 *         }
 *       },
 *       {
 *         type: 'textBlock',
 *         props: {
 *           children: 'Some text'
 *         }
 *       }
 *     ]
 *   }
 */
export function useSectionStructure({sectionPermaId}) {
  const entryState = useEntryState();
  const section = getItem(entryState.collections, 'sections', sectionPermaId)

  return sectionStructure(entryState.collections, section);
};

function sectionStructure(collections, section) {
  return section && {
    permaId: section.permaId,
    id: section.id,
    ...section.configuration,
    foreground: getItems(collections, 'contentElements')
      .filter(
        item => item.sectionId === section.id
      )
      .map(item => ({
        id: item.id,
        permaId: item.permaId,
        type: item.typeName,
        position: item.configuration.position,
        props: item.configuration
      }))
  };
}
