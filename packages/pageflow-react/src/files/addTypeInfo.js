export default function(collectionName, file, modelTypes) {
  if (!file) {
    return null;
  }

  if (!modelTypes[collectionName]) {
    throw new Error(`Could not find model type for collection name ${collectionName}`);
  }

  return {
    ...file,
    collectionName,
    modelType: modelTypes[collectionName]
  };
}
