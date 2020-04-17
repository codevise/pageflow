import reducer from '../reducer';
import {pageChange} from '../actions';


describe('reducer', () => {
  it('updates id when page is activating', () => {
    const result = reducer(5, pageChange({id: 6}));

    expect(result).toBe(6);
  });

  it('keeps state on other action', () => {
    const result = reducer(5, {type: 'OTHER'});

    expect(result).toBe(5);
  });
});
