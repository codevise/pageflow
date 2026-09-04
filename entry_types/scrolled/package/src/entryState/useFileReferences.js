import {useMemo} from 'react';

import {features} from 'pageflow/frontend';

import {
  useEntryStateCollectionItems,
  useEntryStateConfig,
  useMultipleEntryStateCollectionItems
} from './EntryStateProvider';
import {useEntryMetadata} from './metadata';
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
  const entry = useEntryMetadata();
  const sections = useEntryStateCollectionItems('sections');
  const contentElements = useEntryStateCollectionItems('contentElements');
  const collectionNames = useMemo(() => Object.keys(config.fileModelTypes), [config]);
  const files = useMultipleEntryStateCollectionItems(collectionNames);

  return useMemo(
    () => collectEntryFileReferences({
      collections: {entries: [entry], sections, contentElements, ...files},
      locations: config.fileReferenceLocations || {},
      fileModelTypes: config.fileModelTypes
    }),
    [config, entry, sections, contentElements, files]
  );
}

/**
 * Returns a function telling whether a file is referenced in the entry.
 *
 * Considers every file referenced unless the file_rights_from_references
 * feature is enabled, since schemas do not cover all content element
 * types yet.
 *
 * @example
 *
 * const isFileReferenced = useIsFileReferenced();
 * isFileReferenced('imageFiles', 5) // => true
 *
 * @private
 */
export function useIsFileReferenced() {
  const references = useFileReferences();

  return useMemo(() => {
    if (!features.isEnabled('file_rights_from_references')) {
      return () => true;
    }

    return (collectionName, permaId) =>
      references.of(collectionName, permaId).some(({active}) => active);
  }, [references]);
}
