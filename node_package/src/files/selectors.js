import {
  createItemSelector as createCollectionItemSelector,
  createItemsSelector as createCollectionItemsSelector,
} from 'collections';

import {memoizedSelector} from 'utils';

import expandUrls from './expandUrls';
import addTypeInfo from './addTypeInfo';

export function file(collectionName, options) {
  return memoizedSelector(
    createCollectionItemSelector(collectionName, {namespace: 'files'})(options),
    state => state.fileUrlTemplates,
    state => state.modelTypes,
    function(file, fileUrlTemplates, modelTypes) {
      return extendFile(
        collectionName,
        file,
        fileUrlTemplates,
        modelTypes
      );
    }
  );
}

export function nestedFiles(collectionName, {parent}) {
  return memoizedSelector(
    createCollectionItemsSelector(collectionName, {namespace: 'files'}),
    parent,
    state => state.fileUrlTemplates,
    state => state.modelTypes,
    (files, parentFile, fileUrlTemplates, modelTypes) => {
      if (!parentFile) {
        return [];
      }

      return Object.keys(files).reduce((result, fileId) => {
        const file = files[fileId];

        if (file.id &&
            file.parentFileId == parentFile.id &&
            file.parentFileModelType == parentFile.modelType) {

          result.push(extendFile(
            collectionName,
            file,
            fileUrlTemplates,
            modelTypes
          ));
        }

        return result;
      }, []);
    }
  );
}

export function fileExists() {
  return memoizedSelector(
    state => state.files,
    files =>
      function(collectionName, id) {
        return id &&
               !!createCollectionItemSelector(collectionName)({id})(files);
      }
  );
}

function extendFile(collectionName, file, fileUrlTemplates, modelTypes) {
  return addTypeInfo(
    collectionName,
    expandUrls(collectionName,
               file,
               fileUrlTemplates),
    modelTypes
  );
}
