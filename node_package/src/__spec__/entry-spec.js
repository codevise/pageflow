import entry from 'entry';
import {isEntryReady} from 'entry/selectors';

import createStore from 'createStore';
import Backbone from 'backbone';

import {expect} from 'support/chai';

describe('entry', () => {
  function setup() {
    const events = {...Backbone.Events};
    const store = createStore([entry], {events});

    return {
      events,

      select(selector) {
        return selector(store.getState());
      }
    };
  }

  it('sets isEntryReady to false by default', () => {
    const {select} = setup();

    const result = select(isEntryReady);

    expect(result).to.eq(false);
  });

  it('changes isEntryReady to true on ready event', () => {
    const {select, events} = setup();

    events.trigger('ready');
    const result = select(isEntryReady, events);

    expect(result).to.eq(true);
  });
});
