import reducer from '../reducer';
import {init} from '../actions';

import {expect} from 'support/chai';

describe('entry reducer', () => {
  it('sets slug on init', () => {
    const entry = {slug: 'my-entry'};
    const result = reducer(undefined, init({entry}));

    expect(result.slug).to.eq('my-entry');
  });

  it('keeps state on other action', () => {
    const state = {slug: 'my-entry'};
    const result = reducer(state, {type: 'other'});

    expect(result).to.eq(state);
  });
});
