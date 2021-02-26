import {register as registerCookieNoticeBar} from './components/CookieNoticeBar';

import {request, DISMISS, REQUEST} from './actions';
import {isCookieNoticeVisible} from './selectors';

import createReducer from './createReducer';

import {takeEvery} from 'redux-saga';
import {take, call, select, cps} from 'redux-saga/effects';

const COOKIE_KEY = 'cookie_notice_dismissed';

export default {
  init({consent, dispatch, events, isServerSide}) {
    if (!isServerSide) {
      events.on('cookie_notice:request',
                () => {
                  dispatch(request());
                }
               );
      consent.requested.then(function() {
        dispatch(request());
      });
    }
  },

  createReducers({cookies}) {
    return {
      cookieNotice: createReducer({
        hasBeenDismissed: cookies && cookies.hasItem(COOKIE_KEY)
      })
    };
  },

  createSaga: function({widgetsApi, cookies, consent}) {
    return function*() {
      yield takeEvery(REQUEST, function*() {
        if (yield select(isCookieNoticeVisible)) {
          const resetWidgetMargin = yield cps(ensureWidgetMarginBottom, widgetsApi);

          yield take(DISMISS);
          yield call(resetWidgetMargin);
        } else {
          consent.consentResolve();
        }
      });

      yield takeEvery(DISMISS, function*() {
        yield call(function() {
          consent.consentResolve();
          cookies.setItem(COOKIE_KEY, true);
        });
      });
    };
  }
};

function ensureWidgetMarginBottom(widgetsApi, callback) {
  widgetsApi.use({
    name: 'cookie_notice_bar_visible',
    insteadOf: 'cookie_notice_bar'
  }, reset => callback(null, reset));
}

export function registerWidgetTypes() {
  registerCookieNoticeBar();
}
