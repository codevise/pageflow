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
 *           transition: 'scroll',
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
    return getItems(entryState.collections, 'chapters').map(chapter => ({
      permaId: chapter.permaId,
      ...chapter.configuration,
      sections: getItems(entryState.collections, 'sections')
        .filter(
          item => item.chapterId === chapter.id
        )
        .map(section => sectionStructure(entryState.collections, section))
    }));
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
    ...section.configuration,
    foreground: getItems(collections, 'contentElements')
      .filter(
        item => item.sectionId === section.id
      )
      .map(item => ({
        type: item.typeName,
        position: item.configuration.position,
        props: item.configuration
      }))
  };
}
