import {
  createReducer as createCollectionReducer,
  watch
} from 'collections';

import {camelize} from 'utils';

import {combineReducers} from 'redux';

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
          'width', 'height', 'duration_in_ms', 'rights', 'created_at'
        ],
        includeConfiguration: true
      });
    });
  },

  createReducers({files, fileUrlTemplates = {}, modelTypes = {}}) {
    fileUrlTemplates = camelize.keys(fileUrlTemplates);
    modelTypes = camelize.keys(modelTypes);

    return {
      files: combineReducers(Object.keys(files).reduce((result, collectionName) => {
        collectionName = camelize(collectionName);
        result[collectionName] = createCollectionReducer(collectionName);
        return result;
      }, {})),

      fileUrlTemplates: state => fileUrlTemplates,
      modelTypes: state => modelTypes
    };
  }
};
