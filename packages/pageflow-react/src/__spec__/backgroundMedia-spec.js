import backgroundMediaModule from 'backgroundMedia';
import {unmute} from 'backgroundMedia/actions';
import {muted} from 'backgroundMedia/selectors';
import createStore from 'createStore';
import Backbone from 'backbone';

import sinon from 'sinon';

describe('backgroundMedia', () => {
  function setup() {
    const backgroundMedia = {unmute: sinon.spy()};
    const events = {...Backbone.Events};

    const store = createStore([backgroundMediaModule], {backgroundMedia, events});

    return {
      dispatch: store.dispatch.bind(store),

      select(selector) {
        return selector(store.getState());
      },

      backgroundMedia,
      events
    };
  }

  it('is not muted by default', () => {
    const {select} = setup();

    const result = select(muted);

    expect(result).toBe(false);
  });

  it('is muted after mute event', () => {
    const {select, events} = setup();

    events.trigger('background_media:mute');
    const result = select(muted);

    expect(result).toBe(true);
  });

  it('is no longer muted after unmute event', () => {
    const {select, events} = setup();

    events.trigger('background_media:mute');
    events.trigger('background_media:unmute');
    const result = select(muted);

    expect(result).toBe(false);
  });

  it('calls pageflow.backgroundMedia.unmute on unmute action', () => {
    const {dispatch, backgroundMedia} = setup();

    dispatch(unmute());

    expect(backgroundMedia.unmute).toHaveBeenCalled();
  });
});
