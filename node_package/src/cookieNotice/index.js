import {register as registerCookieNoticeBar} from './components/CookieNoticeBar';

import {request, DISMISS} from './actions';

import createReducer from './createReducer';

import {takeEvery} from 'redux-saga';
import {call} from 'redux-saga/effects';

const COOKIE_KEY = 'cookie_notice_dismissed';

export default {
  init({isServerSide, events, dispatch}) {
    if (!isServerSide) {
      events.on('cookie_notice:request',
                () => dispatch(request())
      );
    }
  },

  createReducers({cookies}) {
    return {
      cookieNotice: createReducer({
        hasBeenDismissed: cookies && cookies.hasItem(COOKIE_KEY)
      })
    };
  },

  createSaga: function({cookies}) {
    return function*() {
      yield takeEvery(DISMISS, function*() {
        yield call(function() {
          cookies.setItem(COOKIE_KEY, true);
        });
      });
    };
  }
};

export function registerWidgetTypes() {
  registerCookieNoticeBar();
}
