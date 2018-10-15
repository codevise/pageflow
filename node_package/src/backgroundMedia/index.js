import backgroundMedia from './reducer';

import {mute, unmute} from './actions';

export default {
  init({isServerSide, events, dispatch}) {
    if (!isServerSide) {
      events.on('background_media:mute',
                page => dispatch(mute()));

      events.on('background_media:unmute',
                page => dispatch(unmute()));
    }
  },

  createReducers() {
    return {backgroundMedia};
  }
};
