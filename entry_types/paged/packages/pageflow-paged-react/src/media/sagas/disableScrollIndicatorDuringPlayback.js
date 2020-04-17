import {takeEvery} from 'redux-saga';
import {call, select} from 'redux-saga/effects';

import {PLAY, PAUSE, ENDED} from '../actions';
import {pageIsActive} from 'pages/selectors';

export default function*() {
  yield takeEvery(PLAY, function*() {
    if (yield select(pageIsActive())) {
      yield call(disable);
    }
  });

  yield takeEvery([PAUSE, ENDED], function*() {
    if (yield select(pageIsActive())) {
      yield call(enable);
    }
  });
}

function disable() {
  pageflow.events.trigger('scroll_indicator:disable');
}

function enable() {
  pageflow.events.trigger('scroll_indicator:enable');
}
