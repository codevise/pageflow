import backgroundMedia from './reducer';

import {mute, unmute, UNMUTE} from './actions';

import {register as registerUnmuteButton} from './components/UnmuteButton';

import {takeEvery} from 'redux-saga';
import {call} from 'redux-saga/effects';

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
  },

  createSaga: function({backgroundMedia}) {
    return function*() {
      yield takeEvery(UNMUTE, function*() {
        yield call(() => backgroundMedia.unmute());
      });
    };
  }
};

export function registerWidgetTypes() {
  registerUnmuteButton();
}
