import {useMemo} from 'react';

import {useEntryState} from './EntryStateProvider';
import {getItems} from '../collections';

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
        .map(section => ({
          ...section.configuration,
          foreground: getItems(entryState.collections, 'contentElements')
            .filter(
              item => item.sectionId === section.id
            )
            .map(item => ({
              type: item.typeName,
              position: item.configuration.position,
              props: item.configuration
            }))
        }))
    }));
  }, [entryState]);
};
