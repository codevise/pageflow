import {takeEvery, delay} from 'redux-saga';
import {call, put, select, take, race} from 'redux-saga/effects';

import {PAGE_DID_ACTIVATE, PAGE_WILL_DEACTIVATE} from 'pages/actions';
import {PREBUFFERED, actionCreators} from 'media/actions';
import {pageShouldAutoplay} from 'media/selectors';

const {play, prebuffer, waiting} = actionCreators();

export default function*(options) {
  yield takeEvery(PAGE_DID_ACTIVATE, function*(action) {
    yield race({
      task: call(prebufferAndPlay, options),
      cancel: take(PAGE_WILL_DEACTIVATE)
    });
  });
}

function* prebufferAndPlay(options) {
  const autoplay = yield* autoplayPage(options);

  if (autoplay) {
    yield put(waiting());
  }

  yield [
    take(PREBUFFERED),
    put(prebuffer())
  ];

  if (autoplay) {
    yield call(delay, 1000);
    yield put(play());
  }
}

function* autoplayPage({canAutoplay, autoplayWhenBackgroundMediaMuted}) {
  const shouldAutoplay = yield select(pageShouldAutoplay({
    autoplayWhenBackgroundMediaMuted: () => autoplayWhenBackgroundMediaMuted
  }));

  return shouldAutoplay && canAutoplay;
}
