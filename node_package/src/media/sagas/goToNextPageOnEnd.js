import {takeEvery} from 'redux-saga';
import {call, select} from 'redux-saga/effects';

import {ENDED} from '../actions';

import {pageAttribute, pageIsActive} from 'pages/selectors';

export default function*() {
  yield takeEvery(ENDED, function*() {
    const autoChangePage = yield select(pageAttribute('autoChangePageOnEnded'));
    const pageIsStillActive = yield select(pageIsActive());

    if (autoChangePage && pageIsStillActive) {
      yield call(goToNextPage);
    }
  });
}

function goToNextPage() {
  pageflow.slides.next();
}
