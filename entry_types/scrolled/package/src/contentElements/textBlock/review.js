import {Node, Point} from 'slate';

import {review} from 'pageflow-scrolled/review';

review.contentElementTypes.register('textBlock', {
  compareRanges(a, b) {
    if (!a && !b) return 0;
    if (!a) return 1;
    if (!b) return -1;
    return Point.compare(rangeStart(a), rangeStart(b));
  },

  // Element wide comments stay unquoted: the whole text is too long to serve
  // as a point of reference, and any edit anywhere in it would mark the quote
  // outdated.
  extractQuote(configuration, range) {
    if (!range) return null;

    const root = {children: configuration.value || []};

    if (!Node.has(root, range.anchor.path) || !Node.has(root, range.focus.path)) {
      return null;
    }

    const text = Node.fragment(root, range).map(node => Node.string(node)).join('\n').trim();

    return text || null;
  }
});

function rangeStart(range) {
  return Point.isBefore(range.anchor, range.focus) ? range.anchor : range.focus;
}
