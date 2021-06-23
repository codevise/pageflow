import {register as registerConsentBar} from './components/ConsentBar';
import {request, ACCEPT_ALL, DENY_ALL, SAVE} from './actions';
import createReducer from './createReducer';

import {takeEvery} from 'redux-saga';
import {call, cps, put} from 'redux-saga/effects';

export default {
  createReducers() {
    return {
      consent: createReducer()
    };
  },

  createSaga: function({widgetsApi, consent}) {
    return function*() {
      const {acceptAll, denyAll, save, vendors} = yield call(() => consent.requested());
      yield put(request({vendors}));
      const resetWidgetMargin = yield cps(ensureWidgetMarginBottom, widgetsApi);

      yield takeEvery(ACCEPT_ALL, function*() {
        yield call(resetWidgetMargin);
        acceptAll();
      });

      yield takeEvery(DENY_ALL, function*() {
        yield call(resetWidgetMargin);
        denyAll();
      });

      yield takeEvery(SAVE, function*(action) {
        yield call(resetWidgetMargin);
        save(action.payload);
      });
    };
  }
};

function ensureWidgetMarginBottom(widgetsApi, callback) {
  widgetsApi.use({
    name: 'consent_bar_visible',
    insteadOf: 'consent_bar'
  }, reset => callback(null, reset));
}

export function registerWidgetTypes() {
  registerConsentBar();
}
