import {useEntryMetadata} from "./metadata";
import {useEntryState} from "./EntryStateProvider";
import {getItems} from "../collections";
import {useMemo} from "react";

export function useFileRights() {
  const entryState = useEntryState();

  const defaultFileRights = entryState.config.defaultFileRights;
  const imageFiles = getItems(entryState.collections, 'imageFiles');
  const imageFileRights = imageFiles.map(function (imageConfig) {
    return imageConfig.rights ? imageConfig.rights.trim() : undefined;
  }).filter(Boolean).join(', ');
  const fileRights = !!imageFileRights ? imageFileRights : defaultFileRights.trim();
  const fileRightsString = !!fileRights ? ('Bildrechte: ' + fileRights) : '';

  return useMemo(() => {
    return fileRightsString;
  }, [imageFileRights]);
}

export function useLegalInfo() {
  const entryState = useEntryState();

  return entryState.config.legalInfo;
}

export function useCredits() {
  const entryMetadata = useEntryMetadata();

  let credits = '';
  if(entryMetadata) {
    credits = entryMetadata.credits;
  }

  return credits;
}
