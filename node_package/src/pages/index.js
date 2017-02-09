import createPageStateReducer from './createPageStateReducer';
import createPageSaga from './createPageSaga';
import createReactPageType from './createPageType';
import mergePageTypes from './mergePageTypes';
import {createMiddleware} from 'collections/createSaga';

import {
  createReducer as createCollectionReducer,
  createSaga as createCollectionSaga,
  createItemScopeConnector as createCollectionItemScopeConnector,
  watch
} from 'collections';

export default {
  init({pages, dispatch}) {
    watch({
      collection: pages,
      collectionName: 'pages',
      dispatch,

      idAttribute: 'perma_id',
      attributes: ['perma_id', {type: 'template'}, 'chapter_id'],
      includeConfiguration: true
    });
  },

  createReducers({pageTypes = []}) {
    const pageStateReducers = pageTypes.reduce((result, {name, reducer}) => {
      result[name] = reducer;
      return result;
    }, {});

    return {
      pages: createCollectionReducer('pages', {
        idAttribute: 'permaId',
        itemReducer: createPageStateReducer(pageStateReducers)
      })
    };
  },

  createMiddleware,

  createSaga({pages, pageTypes = [], middleware}) {
    const pageTypeSagas = pageTypes.reduce((result, {name, saga}) => {
      result[name] = saga;
      return result;
    }, {});

    return createCollectionSaga('pages', {
      itemSaga: createPageSaga({pages, pageTypeSagas}),
      middleware
    });
  }
};

export const connectInPage = createCollectionItemScopeConnector('pages');

export function createPageType(options) {
  return mergePageTypes(createReactPageType(options), options.mixin || {});
}
