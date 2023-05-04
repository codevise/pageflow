import {useEntryMetadata} from "./metadata";
import {
  useEntryStateConfig,
  useMultipleEntryStateCollectionItems
} from "./EntryStateProvider";

/**
 * Returns a string (comma-separated list) of copyrights of
 * all files used in the entry.
 * If none of the files has a rights attribute configured,
 * it falls back to the default file rights of the entry's account,
 * otherwise returns an empty string
 *
 * @example
 *
 * const fileRights = useFileRights();
 * fileRights // => "author of image 1, author of video 2"
 */
export function useFileRights() {
  const config = useEntryStateConfig();
  const fileCollectionNames = Object.keys(config.fileModelTypes);
  const files = useMultipleEntryStateCollectionItems(fileCollectionNames);

  const defaultFileRights = config.defaultFileRights?.trim();

  return Array.from(new Set(Object.keys(files).flatMap(key =>
    files[key].map(file =>
      file.rights?.trim() || defaultFileRights
    )
  ))).sort().filter(Boolean).join(', ');
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
