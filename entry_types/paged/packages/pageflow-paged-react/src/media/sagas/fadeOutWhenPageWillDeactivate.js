import {takeEvery} from 'redux-saga';
import {put} from 'redux-saga/effects';

import {actionCreators} from '../actions';
import {PAGE_DID_DEACTIVATE} from 'pages/actions';

export default function*({scope} = {}) {
  const {fadeOutAndPause} = actionCreators({scope});

  yield takeEvery(PAGE_DID_DEACTIVATE, function*() {
    yield put(fadeOutAndPause({fadeDuration: 400}));
  });
}
