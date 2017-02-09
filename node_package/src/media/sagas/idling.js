import {takeLatest, delay} from 'redux-saga';
import {call, put} from 'redux-saga/effects';
import {PLAY, USER_INTERACTION, actionCreators} from '../actions';
import {HOTKEY_TAB} from 'hotkeys/actions';

export default function*() {
  const {userIdle} = actionCreators();
  yield takeLatest([PLAY, USER_INTERACTION, HOTKEY_TAB], putAfterDelay, userIdle);
}

function* putAfterDelay(actionCreator) {
  yield call(delay, 3000);
  yield put(actionCreator());
}
