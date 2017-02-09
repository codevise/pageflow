import {takeEvery, delay} from 'redux-saga';
import {call, put, race, take} from 'redux-saga/effects';

import {PLAYING, PAUSE, ENDED,
        actionCreators} from '../actions';

export default function*() {
  const {hasNotBeenPlayingForAMoment} = actionCreators();

  yield takeEvery([PAUSE, ENDED], function*() {
    yield race({
      task: call(function*(action) {
        yield call(delay, 700);
        yield put(hasNotBeenPlayingForAMoment(false));
      }),
      cancel: take(PLAYING)
    });
  });
}
