import {
  createReducer as createCollectionReducer,
  watch
} from 'collections';

export default {
  init({storylines, dispatch}) {
    watch({
      collection: storylines,
      collectionName: 'storylines',
      dispatch,

      attributes: ['id'],
      includeConfiguration: true
    });
  },

  createReducers() {
    return {
      storylines: createCollectionReducer('storylines')
    };
  }
};
