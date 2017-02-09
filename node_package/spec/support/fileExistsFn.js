export default function fileExistsFn(fileIds) {
  return function(collectionName, id) {
    return fileIds[collectionName] && fileIds[collectionName].includes(id);
  };
}
