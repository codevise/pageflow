import watch from '../watch';
import {PAGE_CHANGE} from '../actions';

import Backbone from 'backbone';

import sinon from 'sinon';

describe('watch', () => {
  it('dispatches page change action on page:change event', () => {
    const dispatch = sinon.spy();
    const events = {...Backbone.Events};

    watch(events, dispatch);
    events.trigger('page:change', {getPermaId() { return 2; }});

    expect(dispatch).toHaveBeenCalledWith(sinon.match({
      type: PAGE_CHANGE,
      payload: {id: 2}
    }));
  });
});
