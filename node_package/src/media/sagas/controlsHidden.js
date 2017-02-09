import {takeEvery, delay} from 'redux-saga';
import {call, put, race, take, select} from 'redux-saga/effects';

import {
  USER_IDLE, USER_INTERACTION,
  CONTROLS_LEFT, CONTROLS_ENTERED,
  PLAY, PAUSED, ENDED,
  actionCreators
} from '../actions';

import {playerState} from '../selectors';
import {widgetPresent} from 'widgets/selectors';
import {HOTKEY_TAB} from 'hotkeys/actions';

const {controlsHidden} = actionCreators();

const classicPlayerControlsPresent = widgetPresent('classicPlayerControls');

export default function*() {
  yield takeEvery([PLAY, USER_IDLE, CONTROLS_LEFT], function*() {
    const state = yield select(playerState());

    if (!state.userIsIdle || state.userHoveringControls || !state.isPlaying) {
      return;
    }

    yield race({
      task: call(function*() {
        if (yield select(classicPlayerControlsPresent)) {
          yield call(delay, 2500);
        }
        else {
          yield call(delay, 1200);
        }

        yield put(controlsHidden());
      }),
      cancel: call(function*() {
        yield take([PAUSED, ENDED, USER_INTERACTION, CONTROLS_ENTERED, HOTKEY_TAB]);
      })
    });
  });
}
