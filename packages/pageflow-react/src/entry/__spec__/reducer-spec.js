import reducer from '../reducer';
import {update} from '../actions';


describe('entry reducer', () => {
  it('sets slug on update', () => {
    const entry = {slug: 'my-entry'};
    const result = reducer(undefined, update({entry}));

    expect(result.slug).toBe('my-entry');
  });

  it('keeps state on other action', () => {
    const state = {slug: 'my-entry'};
    const result = reducer(state, {type: 'other'});

    expect(result).toBe(state);
  });
});
