import {Point} from 'slate';

import {review} from 'pageflow-scrolled/review';

review.contentElementTypes.register('textBlock', {
  compareRanges(a, b) {
    if (!a && !b) return 0;
    if (!a) return 1;
    if (!b) return -1;
    return Point.compare(rangeStart(a), rangeStart(b));
  }
});

function rangeStart(range) {
  return Point.isBefore(range.anchor, range.focus) ? range.anchor : range.focus;
}
