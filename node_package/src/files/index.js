import {
  createReducer as createCollectionReducer,
  watch
} from 'collections';

import {camelize} from 'utils';

export default {
  init({files, dispatch}) {
    Object.keys(files).forEach(collectionName => {
      watch({
        collection: files[collectionName],
        collectionName: camelize(collectionName),
        dispatch,

        attributes: [
          'id', 'basename', 'variants', 'is_ready',
          'parent_file_id', 'parent_file_model_type',
          'width', 'height'
        ],
        includeConfiguration: true
      });
    });
  },

  createReducers({files, fileUrlTemplates = {}, modelTypes = {}}) {
    const reducers = Object.keys(files).reduce((result, collectionName) => {
      collectionName = camelize(collectionName);
      result[collectionName] = createCollectionReducer(collectionName);
      return result;
    }, {});

    fileUrlTemplates = camelize.keys(fileUrlTemplates);
    reducers.fileUrlTemplates = (state => fileUrlTemplates);

    modelTypes = camelize.keys(modelTypes);
    reducers.modelTypes = (state => modelTypes);

    return reducers;
  }
};
