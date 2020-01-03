import {useMemo} from 'react';

import {useCollections, getItems, watchCollection} from './collections';

export function useEntryState(seed) {
  const [collections, dispatch] = useCollections(seed);

  const sectionsWithNestedContentElements = useMemo(() => {
    return getItems(collections, 'sections').map(section => ({
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
    }));
  }, [collections]);

  return [
    {sectionsWithNestedContentElements},
    dispatch
  ]
};

export function watchCollections({sections, contentElements}, {dispatch}) {
  watchCollection(sections, {
    name: 'sections',
    attributes: ['id', 'permaId'],
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
