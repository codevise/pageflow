import reducer from '../reducer';
import {init} from '../actions';

import {expect} from 'support/chai';

describe('reducer', () => {
  it('sets locale on init', () => {
    const result = reducer(undefined, init({locale: 'fr'}));

    expect(result.locale).to.eq('fr');
  });

  it('keeps state on other action', () => {
    const state = {locale: 'fr'};
    const result = reducer(state, {type: 'other'});

    expect(result).to.eq(state);
  });
});
