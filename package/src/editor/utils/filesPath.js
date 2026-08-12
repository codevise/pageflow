// The payload needs to be passed as JSON string since that is the form
// it arrives in when the sidebar route is parsed.
export function filesPath({
  collectionName,
  folderPermaId,
  handler,
  payload,
  filterName
} = {}) {
  let path = '/files';

  if (collectionName) {
    path += '/' + collectionName;
  }

  if (folderPermaId) {
    path += '/folders/' + folderPermaId;
  }

  if (!handler) {
    return path;
  }

  return path +
         '?handler=' + handler +
         '&payload=' + encodeURIComponent(payload) +
         (filterName ? '&filter=' + filterName : '');
}
