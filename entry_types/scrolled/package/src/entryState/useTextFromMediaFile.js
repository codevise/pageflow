import {useEntryState} from './EntryStateProvider';
import {expandUrls} from './expandUrls';

export function useTextFromMediaFile({collectionName, mediaFileId}) {
  const entryState = useEntryState();
  var textTracks = entryState.collections.textTrackFiles?  entryState.collections.textTrackFiles.items : [];
  var items = _.filter(textTracks, function(value, key){ return value.parentFileId==mediaFileId})
  var result = [];
  for (let index = 0; index < items.length; index++) {
    const item = items[index];
    result.push(expandUrls(
      collectionName,
      item,
      entryState.config.fileUrlTemplates
    ));
  }
  return result;
}
