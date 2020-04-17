import {
  createReducer as createCollectionReducer,
  watch
} from 'collections';

export default {
  init({chapters, dispatch}) {
    watch({
      collection: chapters,
      collectionName: 'chapters',
      dispatch,

      attributes: ['id', 'title', 'position', 'storyline_id']
    });
  },

  createReducers() {
    return {
      chapters: createCollectionReducer('chapters')
    };
  }
};
