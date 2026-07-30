import {Node} from 'slate';

import {review} from 'pageflow-scrolled/review';

// Headings carry no ranged comments since EditableInlineText has no
// commenting alternative, so every comment refers to the header as a whole
// and the quote covers all three of its texts.
review.contentElementTypes.register('heading', {
  extractQuote(configuration) {
    const parts = [
      inlineText(configuration.tagline),
      mainText(configuration),
      inlineText(configuration.subtitle)
    ];

    return parts.map(part => part.trim()).filter(Boolean).join('\n') || null;
  }
});

// Mirrors how EditableInlineText picks the legacy string value, so the quote
// never contains text the heading does not display.
function mainText(configuration) {
  return configuration.value ?
         inlineText(configuration.value) :
         configuration.children || '';
}

function inlineText(value) {
  return value ? value.map(node => Node.string(node)).join(' ') : '';
}
