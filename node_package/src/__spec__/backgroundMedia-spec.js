import backgroundMedia from 'backgroundMedia';
import {muted} from 'backgroundMedia/selectors';
import createStore from 'createStore';
import Backbone from 'backbone';

import {expect} from 'support';

describe('backgroundMedia', () => {
  function setup() {
    const events = {...Backbone.Events};

    const store = createStore([backgroundMedia], {events});

    return {
      dispatch: store.dispatch.bind(store),

      select(selector) {
        return selector(store.getState());
      },

      events
    };
  }

  it('is not muted by default', () => {
    const {select} = setup();

    const result = select(muted);

    expect(result).to.eq(false);
  });

  it('is muted after mute event', () => {
    const {select, events} = setup();

    events.trigger('background_media:mute');
    const result = select(muted);

    expect(result).to.eq(true);
  });

  it('is no longer muted after unmute event', () => {
    const {select, events} = setup();

    events.trigger('background_media:mute');
    events.trigger('background_media:unmute');
    const result = select(muted);

    expect(result).to.eq(false);
  });
});
