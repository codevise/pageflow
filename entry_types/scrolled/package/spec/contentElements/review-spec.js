import 'contentElements/review';
import {review} from 'review';

describe('contentElements/review', () => {
  it('registers quote extraction of content element types in review api', () => {
    expect(review.contentElementTypes.findExtractQuote('heading')).toBeDefined();
    expect(review.contentElementTypes.findExtractQuote('textBlock')).toBeDefined();
  });
});
