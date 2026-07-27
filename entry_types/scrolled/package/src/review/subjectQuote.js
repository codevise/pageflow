import {useMemo} from 'react';

import {useContentElement} from 'pageflow-scrolled/entryState';

import {review} from './api';

// Matches Pageflow::Comment::QUOTE_LIMIT. Capping here rather than only on
// the server keeps a recorded quote comparable to the text as it reads later
// on: a quote the server had cut would differ from the full text forever and
// count as outdated even while the wording was untouched.
const QUOTE_LIMIT = 4000;

// The range is passed on as is, including when there is none: types with
// ranged comments quote the selection and skip range-less subjects, types
// whose comments always cover the whole element quote its text either way.
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
