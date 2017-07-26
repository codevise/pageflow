import reducer from './reducer';

import {load} from './actions';

export default {
  init({isServerSide, events, widgetsApi, dispatch}) {
    function update() {
      dispatch(load({
        widgets: {
          classicPlayerControls: widgetsApi.isPresent('classic_player_controls'),
          slimPlayerControls: widgetsApi.isPresent('slim_player_controls')
        }
      }));
    }

    if (!isServerSide) {
      events.on('widgets:update', update);
      update();
    }
  },

  createReducers() {
    return {widgetPresence: reducer};
  }
};
