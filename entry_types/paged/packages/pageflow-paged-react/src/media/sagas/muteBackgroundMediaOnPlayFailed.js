import {PLAY_FAILED, PLAYING_MUTED} from '../actions';

import {takeEvery} from 'redux-saga';
import {call} from 'redux-saga/effects';

export default function*() {
  yield takeEvery([PLAY_FAILED, PLAYING_MUTED], muteBackgoundAudio);
}

function* muteBackgoundAudio() {
  yield call(() => pageflow.backgroundMedia.mute());
}
