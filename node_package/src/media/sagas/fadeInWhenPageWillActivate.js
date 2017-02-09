import {takeEvery} from 'redux-saga';
import {put, take, call, race} from 'redux-saga/effects';

import {PREBUFFERED, actionCreators} from '../actions';
import {PAGE_WILL_ACTIVATE, PAGE_WILL_DEACTIVATE} from 'pages/actions';

export default function*({scope} = {}) {
  const actions = actionCreators({scope});

  yield takeEvery(PAGE_WILL_ACTIVATE, function*(action) {
    yield race({
      task: call(prebufferAndPlay, actions),
      cancel: take(PAGE_WILL_DEACTIVATE)
    });
  });
}

function* prebufferAndPlay({prebuffer, playAndFadeIn}) {
  yield [
    take(PREBUFFERED),
    put(prebuffer())
  ];

  yield put(playAndFadeIn({fadeDuration: 1000}));
}
