import cookieNotice from 'cookieNotice';
import {isCookieNoticeVisible} from 'cookieNotice/selectors';
import {dismiss} from 'cookieNotice/actions';
import createStore from 'createStore';
import Backbone from 'backbone';

import {expect} from 'support/chai';

describe('cookieNotice', () => {
  function setup(cookies = fakeCookies()) {
    const events = {...Backbone.Events};

    const store = createStore([cookieNotice], {cookies, events});

    return {
      dispatch: store.dispatch.bind(store),

      select(selector) {
        return selector(store.getState());
      },

      cookies,
      events
    };
  }

  function fakeCookies() {
    const cookies = {};

    return {
      hasItem(key) { return cookies[key]; },

      setItem(key, value) { cookies[key] = value; }
    };
  }

  it('is invisible by default', () => {
    const {select} = setup();

    const result = select(isCookieNoticeVisible);

    expect(result).to.eq(false);
  });

  it('becomes visible once requested', () => {
    const {select, events} = setup();

    events.trigger('cookie_notice:request');
    const result = select(isCookieNoticeVisible);

    expect(result).to.eq(true);
  });

  it('stays invisible if dismissed before', () => {
    const cookies = fakeCookies();

    const {dispatch} = setup(cookies);
    dispatch(dismiss());

    const {select, events} = setup(cookies);

    events.trigger('cookie_notice:request');
    const result = select(isCookieNoticeVisible);

    expect(result).to.eq(false);
  });
});
