import {pageAttribute} from './selectors';
import scheduleUnprepare from './sagas/scheduleUnprepare';
import updating from './sagas/updating';
import {ENHANCE, CLEANUP} from './actions';

import {select, fork, cancel} from 'redux-saga/effects';
import {takeEvery} from 'redux-saga';

export default function({pages, pageTypeSagas}) {
  return function*() {
    yield* scheduleUnprepare();
    yield* updating(pages);

    let task;

    yield takeEvery(ENHANCE, function*() {
      const thisPageType = yield select(pageAttribute('type'));
      const pageTypeSaga = pageTypeSagas[thisPageType];

      if (pageTypeSaga) {
        task = yield fork(pageTypeSaga);
      }
    });

    yield takeEvery(CLEANUP, function*() {
      if (task) {
        yield cancel(task);
      }
    });
  };
}
