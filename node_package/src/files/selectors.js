import {
  createItemSelector as createCollectionItemSelector,
  createItemsSelector as createCollectionItemsSelector,
} from 'collections';

import expandUrls from './expandUrls';
import addTypeInfo from './addTypeInfo';

export function file(collectionName, options) {
  const selector = createCollectionItemSelector(collectionName)(options);

  return function(state, props) {
    return extendFile(
      collectionName,
      selector(state, props),
      state
    );
  };
}

export function nestedFiles(collectionName, {parent}) {
  const itemsSelector = createCollectionItemsSelector(collectionName);

  return function(state, props) {
    const files = itemsSelector(state, props);
    const parentFile = parent(state, props);

    if (!parentFile) {
      return [];
    }

    return Object.keys(files).reduce((result, fileId) => {
      const file = files[fileId];

      if (file.id &&
          file.parentFileId == parentFile.id &&
          file.parentFileModelType == parentFile.modelType) {
        result.push(extendFile(collectionName, file, state));
      }

      return result;
    }, []);
  };
}

export function fileExists() {
  return function(state, props) {
    return function(collectionName, id) {
      return id &&
             !!createCollectionItemSelector(collectionName)({id})(state, props);
    };
  };
}

function extendFile(collectionName, file, state) {
  return addTypeInfo(
    collectionName,
    expandUrls(collectionName,
               file,
               state.fileUrlTemplates),
    state.modelTypes
  );
}
