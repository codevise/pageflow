import {useMemo} from 'react';

import {
  useEntryStateCollectionItems,
  useEntryStateConfig,
  useMultipleEntryStateCollectionItems
} from './EntryStateProvider';
import {collectEntryFileReferences} from '../shared/collectEntryFileReferences';

/**
 * Returns the file references of the entry, indexed by file.
 *
 * @example
 *
 * const references = useFileReferences();
 * references.of('imageFiles', 5)
 * // => [{subject: {model: 'section', permaId: 12}, active: true}]
 *
 * @private
 */
export function useFileReferences() {
  const config = useEntryStateConfig();
  const sections = useEntryStateCollectionItems('sections');
  const contentElements = useEntryStateCollectionItems('contentElements');
  const collectionNames = useMemo(() => Object.keys(config.fileModelTypes), [config]);
  const files = useMultipleEntryStateCollectionItems(collectionNames);

  return useMemo(
    () => collectEntryFileReferences({
      collections: {sections, contentElements, ...files},
      locations: config.fileReferenceLocations || {},
      fileModelTypes: config.fileModelTypes
    }),
    [config, sections, contentElements, files]
  );
}
