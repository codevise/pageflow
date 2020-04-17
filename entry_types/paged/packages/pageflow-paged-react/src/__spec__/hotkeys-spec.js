import hotkeysModule from '../hotkeys';
import {HOTKEY_TAB} from '../hotkeys/actions';
import {TAB} from 'utils/keyCodes';

import currentModule from 'current';
import {pageChange} from 'current/actions';

import createStore from 'createStore';
import Backbone from 'backbone';
import {takeEvery} from 'redux-saga';

import sinon from 'sinon';

describe('hotkeys.watchEvents', () => {
  it('dispatches action for current page when tab key is pressed', () => {
    const window = {
      addEventListener(name, handler) {
        this.handler = handler;
      },

      trigger(event) {
        this.handler(event);
      }
    };

    const spy = sinon.spy();
    const spyModule = {
      createSaga() {
        return function*() {
          yield takeEvery(HOTKEY_TAB, spy);
        };
      }
    };
    const store = createStore([hotkeysModule, currentModule, spyModule], {window, events: new Backbone.Model()});
    store.subscribe(spy);

    store.dispatch(pageChange({id: 5}));
    window.trigger({keyCode: TAB});

    expect(spy).toHaveBeenCalledWith(sinon.match({
      type: HOTKEY_TAB,
      meta: {
        itemId: 5
      }
    }));
  });
});
