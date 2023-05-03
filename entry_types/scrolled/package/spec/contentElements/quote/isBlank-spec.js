import {isBlank} from 'contentElements/quote/isBlank';

describe('isBlank', () => {
  it('return true for empty array', () => {
    expect(isBlank([])).toEqual(true);
  });

  it('returns true for node with single empty text child', () => {
    expect(isBlank([{children: [{text: ''}]}])).toEqual(true);
  });

  it('returns false for node with non-empty text child', () => {
    expect(isBlank([{children: [{text: 'some text'}]}])).toEqual(false);
  });

  it('returns false for multiple  nodes with empty text child', () => {
    expect(isBlank([
      {children: [{text: ''}]},
      {children: [{text: ''}]}
    ])).toEqual(false);
  });
});
