import {useEntryMetadata} from "./metadata";
import {
  useEntryStateConfig,
  useMultipleEntryStateCollectionItems
} from "./EntryStateProvider";
import {useIsFileReferenced} from './useFileReferences';

/**
 * Returns a collection of rights and source urls of the files
 * referenced in the entry. If none of the files has a rights attribute
 * configured, it falls back to the default file rights of the
 * entry's site, otherwise returns an empty array.
 *
 * Lists all files of the entry unless the file_rights_from_references
 * feature is enabled, since schemas do not cover all content element
 * types yet.
 *
 * @example
 *
 * const fileRights = useFileRights();
 * fileRights // => [{text: 'author of image 1', urls: ['https://example.com/source-url']}]
 */
export function useFileRights() {
  const config = useEntryStateConfig();
  const fileCollectionNames = Object.keys(config.fileModelTypes);
  const files = useMultipleEntryStateCollectionItems(fileCollectionNames);
  const isFileReferenced = useIsFileReferenced();

  const defaultFileRights = config.defaultFileRights?.trim();

  const items = {};

  Object.keys(files).forEach(collectionName =>
    files[collectionName]
      .filter(file => file.configuration.rights_display !== 'inline')
      .filter(file => isFileReferenced(collectionName, file.permaId))
      .forEach(file => {
        const text = file.rights?.trim() || defaultFileRights;

        if (text) {
          items[text] = items[text] || {text, urls: new Set()}

          if (file.configuration.source_url?.trim()) {
            items[text].urls.add(file.configuration.source_url);
          }
        }
      })
  );

  return Object.values(items)
               .map(item => ({...item, urls: Array.from(item.urls).sort()}))
               .sort((a, b) => a.text.localeCompare(b.text));
}

/**
 * Returns a nested data structure representing the legal info of the entry.
 * Each legal info is separated into label and url to use in links.
 * Both label and url can be blank, depending on the configuration.
 *
 * @example
 *
 * const legalInfo = useLegalInfo();
 * legalInfo // =>
 *   {
 *     imprint: {
 *       label: '',
 *       url: ''
 *     },
 *     copyright: {
 *       label: '',
 *       url: ''
 *     },
 *     privacy: {
 *       label: '',
 *       url: ''
 *     }
 *   }
 */
export function useLegalInfo() {
  const config = useEntryStateConfig();

  return config.legalInfo;
}

/**
 * Returns the credits string (rich text) of the entry.
 *
 * @example
 *
 * const credits = useCredits();
 * credits // => "Credits: <a href="http://pageflow.com">pageflow.com</a>"
 */
export function useCredits() {
  const entryMetadata = useEntryMetadata();

  let credits = '';
  if(entryMetadata) {
    credits = entryMetadata.credits;
  }

  return credits;
}
