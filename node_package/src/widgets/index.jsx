import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';

import {
  createReducer as createCollectionReducer,
  watch
} from 'collections';

export default {
  init({widgets, dispatch}) {
    watch({
      collection: widgets,
      collectionName: 'widgets',
      dispatch,

      attributes: ['role', 'type_name', 'editing'],
      includeConfiguration: true
    });
  },

  createReducers() {
    return {
      widgets: createCollectionReducer('widgets', {
        idAttribute: 'role'
      })
    };
  }
};

export function createWidgetType(Component, store) {
  return {
    enhance: function(element) {
      ReactDOM.render(
        <Provider store={store}>
          <Component />
        </Provider>,
        element[0]
      );
    }
  };
}
