import {TOGGLE_PLAYING, actionCreators} from '../actions';
import {HOTKEY_SPACE} from 'hotkeys/actions';
import {playerState} from '../selectors';

import {takeEvery} from 'redux-saga';
import {put, select, call} from 'redux-saga/effects';

export default function*() {
  yield takeEvery([HOTKEY_SPACE, TOGGLE_PLAYING], toggle, actionCreators());
}

function* toggle({play, pause}) {
  const state = yield select(playerState());

  if (state.shouldPlay) {
    yield put(pause());
  }
  else {
    yield call(() => pageflow.backgroundMedia.unmute());
    yield put(play());
  }
}
