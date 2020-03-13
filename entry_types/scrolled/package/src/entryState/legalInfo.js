import {useEntryMetadata} from "./metadata";
import {useEntryState} from "./EntryStateProvider";
import {getItems} from "../collections";
import {useMemo} from "react";

/**
 * Returns a string (comma-separated list) of copyrights of
 * all images used in the entry.
 * If none of the images has a rights attribute configured,
 * it falls back to the default file rights of the entry's account,
 * otherwise returns an empty string
 *
 * @example
 *
 * const fileRights = useFileRights();
 * fileRights // => "author of image 1, author of image 2"
 */
export function useFileRights() {
  const entryState = useEntryState();

  const defaultFileRights = entryState.config.defaultFileRights;
  const imageFiles = getItems(entryState.collections, 'imageFiles');
  const imageFileRights = imageFiles.reduce(function(result, imageConfig) {
    if(imageConfig && imageConfig.rights) {
      result.push(imageConfig.rights.trim());
    }
    return result;
  }, []).filter(Boolean).join(', ');
  const fileRights = !!imageFileRights ? imageFileRights : defaultFileRights.trim();
  const fileRightsString = !!fileRights ? ('Bildrechte: ' + fileRights) : '';

  return fileRightsString;
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
  const entryState = useEntryState();

  return entryState.config.legalInfo;
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
