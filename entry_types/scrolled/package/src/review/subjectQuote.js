import {useMemo} from 'react';

import {useContentElement} from 'pageflow-scrolled/entryState';

import {review} from './api';

// Matches Pageflow::Comment::QUOTE_LIMIT.
const QUOTE_LIMIT = 4000;

/**
 * @private
 */
export function useSubjectQuote({subjectType, subjectId, subjectRange}) {
  const contentElement = useContentElement({permaId: subjectId});
  const isContentElement = subjectType === 'ContentElement';

  return useMemo(() => {
    if (!isContentElement || !contentElement) return null;

    const extractQuote = review.contentElementTypes.findExtractQuote(contentElement.type);
    const quote = extractQuote ? extractQuote(contentElement.props, subjectRange) : null;

    return quote ? quote.slice(0, QUOTE_LIMIT) : null;
  }, [isContentElement, subjectRange, contentElement]);
}
