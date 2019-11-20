import reducer from '../reducer';
import {init} from '../actions';


describe('reducer', () => {
  it('sets locale on init', () => {
    const result = reducer(undefined, init({locale: 'fr'}));

    expect(result.locale).toBe('fr');
  });

  it('keeps state on other action', () => {
    const state = {locale: 'fr'};
    const result = reducer(state, {type: 'other'});

    expect(result).toBe(state);
  });
});
