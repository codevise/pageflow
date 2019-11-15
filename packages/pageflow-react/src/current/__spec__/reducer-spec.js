import reducer from '../reducer';
import {pageChange} from '../actions';

import {expect} from 'support/chai';

describe('reducer', () => {
  it('updates id when page is activating', () => {
    const result = reducer(5, pageChange({id: 6}));

    expect(result).to.eq(6);
  });

  it('keeps state on other action', () => {
    const result = reducer(5, {type: 'OTHER'});

    expect(result).to.eq(5);
  });
});
