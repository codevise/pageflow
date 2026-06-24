import 'contentElements/textBlock/review';
import {review} from 'review';

describe('contentElements/textBlock/review', () => {
  const compareRanges = review.contentElementTypes.findCompareRanges('textBlock');

  function range(anchor, focus) {
    return {
      anchor: {path: [anchor[0], anchor[1]], offset: anchor[2]},
      focus: {path: [focus[0], focus[1]], offset: focus[2]}
    };
  }

  it('orders ranges by start block', () => {
    const earlier = range([0, 0, 0], [0, 0, 5]);
    const later = range([1, 0, 0], [1, 0, 5]);

    expect(compareRanges(earlier, later)).toBeLessThan(0);
    expect(compareRanges(later, earlier)).toBeGreaterThan(0);
  });

  it('orders ranges within the same block by offset', () => {
    const earlier = range([0, 0, 2], [0, 0, 4]);
    const later = range([0, 0, 6], [0, 0, 8]);

    expect(compareRanges(earlier, later)).toBeLessThan(0);
  });

  it('uses the smaller of anchor and focus as the start point', () => {
    const reversed = range([0, 0, 8], [0, 0, 2]);
    const forward = range([0, 0, 5], [0, 0, 6]);

    expect(compareRanges(reversed, forward)).toBeLessThan(0);
  });

  it('returns 0 for equal ranges', () => {
    const r = range([0, 0, 0], [0, 0, 5]);

    expect(compareRanges(r, r)).toBe(0);
  });

  it('sorts range-less subjects last', () => {
    const r = range([0, 0, 0], [0, 0, 5]);

    expect(compareRanges(undefined, r)).toBeGreaterThan(0);
    expect(compareRanges(r, undefined)).toBeLessThan(0);
    expect(compareRanges(undefined, undefined)).toBe(0);
  });
});
