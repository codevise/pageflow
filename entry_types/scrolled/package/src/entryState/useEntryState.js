import {useMemo} from 'react';

import {useCollections, getItems} from '../collections';

export function useEntryState(seed = {}) {
  const [collections, dispatch] = useCollections(seed.collections, {keyAttribute: 'permaId'});

  const entryStructure = useMemo(() => {
    return getItems(collections, 'chapters').map(chapter => ({
      permaId: chapter.permaId,
      ...chapter.configuration,
      sections: getItems(collections, 'sections')
        .filter(
          item => item.chapterId === chapter.id
        )
        .map(section => ({
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
        }))
    }));
  }, [collections]);

  const entryState = useMemo(() => ({
    collections,
    config: seed.config
  }), [collections, seed]);

  return [
    {entryStructure, entryState},
    dispatch
  ]
};
