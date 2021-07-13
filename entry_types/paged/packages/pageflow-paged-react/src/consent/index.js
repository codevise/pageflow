import {register as registerConsentBar} from './components/ConsentBar';
import {Settings} from './components/Settings';
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

      yield takeEvery(ACCEPT_ALL, function() {
        acceptAll();
      });

      yield takeEvery(DENY_ALL, function() {
        denyAll();
      });

      yield takeEvery(SAVE, function(action) {
        save(action.payload);
      });
    };
  }
};

export function registerWidgetTypes() {
  registerConsentBar();
}

export {Settings};
