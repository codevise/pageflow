import {takeLatest, delay} from 'redux-saga';
import {call, put} from 'redux-saga/effects';

import {PAGE_SCHEDULE_UNPREPARE, PAGE_DID_PREPARE, PAGE_WILL_ACTIVATE,
        pageDidUnprepare} from '../actions';

export default function*() {
  yield takeLatest([PAGE_SCHEDULE_UNPREPARE, PAGE_DID_PREPARE, PAGE_WILL_ACTIVATE], scheduleUnprepare);
}

function* scheduleUnprepare(action) {
  if (action.type == PAGE_SCHEDULE_UNPREPARE) {
    yield call(delay, 5000);
    yield put(pageDidUnprepare());
  }
}
