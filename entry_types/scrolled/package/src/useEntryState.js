import {useMemo} from 'react';

import {useCollections, getItems, watchCollection} from './collections';

export function useEntryState(seed) {
  const [collections, dispatch] = useCollections(seed);

  const entryStructure = useMemo(() => {
    return getItems(collections, 'chapters').map(chapter => ({
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

  return [
    {entryStructure},
    dispatch
  ]
};

export function watchCollections({chapters, sections, contentElements}, {dispatch}) {
  watchCollection(chapters, {
    name: 'chapters',
    attributes: ['id', 'permaId'],
    includeConfiguration: true,
    dispatch
  });
  watchCollection(sections, {
    name: 'sections',
    attributes: ['id', 'permaId', 'chapterId'],
    includeConfiguration: true,
    dispatch
  });
  watchCollection(contentElements, {
    name: 'contentElements',
    attributes: ['id', 'permaId', 'typeName', 'sectionId'],
    keyAttribute: 'permaId',
    includeConfiguration: true,
    dispatch
  });
}
