import {commentsWithOutdatedQuote} from 'review/outdatedQuotes';

describe('commentsWithOutdatedQuote', () => {
  function ids(comments, currentQuote) {
    return [...commentsWithOutdatedQuote(comments, currentQuote)];
  }

  it('picks comments whose quote differs from the current text', () => {
    const comments = [{id: 1, quote: 'old wording'}];

    expect(ids(comments, 'new wording')).toEqual([1]);
  });

  it('skips comments whose quote still matches the current text', () => {
    const comments = [{id: 1, quote: 'same wording'}];

    expect(ids(comments, 'same wording')).toEqual([]);
  });

  it('only marks the first of consecutive comments sharing a quote', () => {
    const comments = [
      {id: 1, quote: 'first wording'},
      {id: 2, quote: 'first wording'},
      {id: 3, quote: 'second wording'}
    ];

    expect(ids(comments, 'current wording')).toEqual([1, 3]);
  });

  it('skips a changed quote that matches the current text', () => {
    const comments = [
      {id: 1, quote: 'old wording'},
      {id: 2, quote: 'current wording'}
    ];

    expect(ids(comments, 'current wording')).toEqual([1]);
  });

  it('marks a quote returning to an earlier wording after an intermediate one', () => {
    const comments = [
      {id: 1, quote: 'old wording'},
      {id: 2, quote: 'current wording'},
      {id: 3, quote: 'old wording'}
    ];

    expect(ids(comments, 'current wording')).toEqual([1, 3]);
  });

  it('marks every quote when the text is gone', () => {
    const comments = [
      {id: 1, quote: 'first wording'},
      {id: 2, quote: 'second wording'}
    ];

    expect(ids(comments, null)).toEqual([1, 2]);
  });

  it('ignores comments recorded without a quote', () => {
    const comments = [
      {id: 1},
      {id: 2, quote: 'some wording'},
      {id: 3}
    ];

    expect(ids(comments, 'current wording')).toEqual([2]);
  });
});
