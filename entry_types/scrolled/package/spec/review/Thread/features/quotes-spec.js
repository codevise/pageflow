import React from 'react';
import '@testing-library/jest-dom/extend-expect';

import {Thread} from 'review/Thread';
import {review} from 'review/api';
import {renderWithReviewState} from 'support/renderWithReviewState';

describe('Thread comment quotes', () => {
  const thread = {
    id: 1,
    comments: [{id: 10, body: 'On the pull quote', creatorName: 'Bob', creatorId: 2}]
  };

  const seed = {
    sections: [{id: 1, permaId: 1}],
    contentElements: [
      {
        id: 1, permaId: 10, sectionId: 1, typeName: 'textBlock',
        configuration: {value: 'Current wording'}
      }
    ]
  };

  const quotingThread = {
    ...thread,
    subjectType: 'ContentElement',
    subjectId: 10,
    subjectRange: {anchor: {path: [0, 0], offset: 0}, focus: {path: [0, 0], offset: 7}}
  };

  function threadWithQuotes(...quotes) {
    return {
      ...quotingThread,
      comments: quotes.map((quote, index) => ({
        id: 10 + index,
        body: `Comment ${index + 1}`,
        creatorName: 'Bob',
        creatorId: 2,
        quote
      }))
    };
  }

  beforeEach(() => {
    review.contentElementTypes.register('textBlock', {
      extractQuote: configuration => configuration.value
    });
  });

  afterEach(() => {
    review.contentElementTypes.types = {};
  });

  it('renders a quote for a comment whose text has since changed', () => {
    const {getByText} = renderWithReviewState(
      <Thread thread={threadWithQuotes('Original wording')} interactive={false} />,
      {seed}
    );

    expect(getByText('Original wording')).toBeInTheDocument();
  });

  it('renders no quote while the text still reads the same', () => {
    const {container} = renderWithReviewState(
      <Thread thread={threadWithQuotes('Current wording')} interactive={false} />,
      {seed}
    );

    expect(container.querySelector('blockquote')).toBeNull();
  });

  it('renders the quote inside the comment, above its body', () => {
    const {getByText} = renderWithReviewState(
      <Thread thread={threadWithQuotes('Original wording')} interactive={false} />,
      {seed}
    );

    const quote = getByText('Original wording');
    const body = getByText('Comment 1');

    expect(quote.parentNode).toBe(body.parentNode);
    expect(quote.compareDocumentPosition(body) & Node.DOCUMENT_POSITION_FOLLOWING)
      .toBeTruthy();
  });

  it('renders a quote per version once the text changes mid thread', () => {
    const {getByText} = renderWithReviewState(
      <Thread thread={threadWithQuotes('First wording', 'Second wording')}
              interactive={false} />,
      {seed}
    );

    expect(getByText('First wording')).toBeInTheDocument();
    expect(getByText('Second wording')).toBeInTheDocument();
  });

  it('renders the quote once for a run of replies about the same wording', () => {
    const {queryAllByText} = renderWithReviewState(
      <Thread thread={threadWithQuotes('Same wording', 'Same wording')}
              interactive={false} />,
      {seed}
    );

    expect(queryAllByText('Same wording')).toHaveLength(1);
  });

  it('renders no quote for the last comment when it matches the current text', () => {
    const {getByText, queryByText} = renderWithReviewState(
      <Thread thread={threadWithQuotes('Original wording', 'Current wording')}
              interactive={false} />,
      {seed}
    );

    expect(getByText('Original wording')).toBeInTheDocument();
    expect(queryByText('Current wording')).not.toBeInTheDocument();
  });

  it('renders quotes for threads whose content element was deleted', () => {
    const {getByText} = renderWithReviewState(
      <Thread thread={{...threadWithQuotes('Original wording'),
                       subjectId: 999,
                       orphaned: true}}
              interactive={false} />,
      {seed}
    );

    expect(getByText('Original wording')).toBeInTheDocument();
  });

  it('renders no quote for comments recorded without one', () => {
    const {container} = renderWithReviewState(
      <Thread thread={quotingThread} interactive={false} />,
      {seed}
    );

    expect(container.querySelector('blockquote')).toBeNull();
  });
});
