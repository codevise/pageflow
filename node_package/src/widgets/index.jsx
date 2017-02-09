import reducer from './reducer';

import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';

import {load} from './actions';

export default {
  init({isServerSide, events, widgets, dispatch}) {
    function update() {
      dispatch(load({
        widgets: {
          classicPlayerControls: widgets.isPresent('classic_player_controls'),
          slimPlayerControls: widgets.isPresent('slim_player_controls')
        }
      }));
    }

    if (!isServerSide) {
      events.on('widgets:update', update);
      update();
    }
  },

  createReducers() {
    return {widgets: reducer};
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
