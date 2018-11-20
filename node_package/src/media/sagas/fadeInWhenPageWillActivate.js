import {takeEvery} from 'redux-saga';
import {put, take, call, race} from 'redux-saga/effects';

import {PREBUFFERED, actionCreators} from '../actions';
import {PAGE_WILL_ACTIVATE, PAGE_DID_ACTIVATE, PAGE_WILL_DEACTIVATE} from 'pages/actions';

export default function*({scope} = {}) {
  const actions = actionCreators({scope});

  yield takeEvery(PAGE_WILL_ACTIVATE, function*(action) {
    yield [
      race({
        task: [
          put(actions.prebuffer()),
          call(playSilentlyWhenPrebuffered, actions),
          call(fadeInOnPageDidActivateAndPrebuffered, actions)
        ],
        cancel: take(PAGE_WILL_DEACTIVATE)
      }),
    ];
  });
}

function* playSilentlyWhenPrebuffered({prebuffer, changeVolumeFactor, play}) {
  yield put(changeVolumeFactor(0, {fadeDuration: 0}));

  yield take(PREBUFFERED);
  yield put(play());
}

function* fadeInOnPageDidActivateAndPrebuffered({changeVolumeFactor}) {
  yield [
    take(PREBUFFERED),
    take(PAGE_DID_ACTIVATE)
  ];
  yield put(changeVolumeFactor(1, {fadeDuration: 1000}));
}
