import {register as registerCookieNoticeBar} from './components/CookieNoticeBar';

import {request, DISMISS, REQUEST} from './actions';
import {isCookieNoticeVisible} from './selectors';

import createReducer from './createReducer';

import {takeEvery} from 'redux-saga';
import {take, call, select, cps} from 'redux-saga/effects';

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

  createSaga: function({widgetsApi, cookies}) {
    return function*() {
      yield takeEvery(REQUEST, function*() {
        if (yield select(isCookieNoticeVisible)) {
          const resetWidgetMargin = yield cps(ensureWidgetMarginBottom, widgetsApi);

          yield take(DISMISS);
          yield call(resetWidgetMargin);
        }
      });

      yield takeEvery(DISMISS, function*() {
        yield call(function() {
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
