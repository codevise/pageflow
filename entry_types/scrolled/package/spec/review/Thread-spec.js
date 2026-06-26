import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {useFakeTranslations} from 'pageflow/testHelpers';

import {Thread} from 'review/Thread';
import {renderWithReviewState} from 'support/renderWithReviewState';

describe('Thread', () => {
  useFakeTranslations({
    'pageflow_scrolled.review.refers_to_deleted_element': 'Refers to a deleted element'
  });

  const thread = {
    id: 1,
    comments: [{id: 10, body: 'On the pull quote', creatorName: 'Bob', creatorId: 2}]
  };

  it('renders a deleted-element hint when the thread is orphaned', () => {
    const {getByText} = renderWithReviewState(
      <Thread thread={{...thread, orphaned: true}} interactive={false} />
    );

    expect(getByText('Refers to a deleted element')).toBeInTheDocument();
  });

  it('does not render the hint for a normal thread', () => {
    const {queryByText} = renderWithReviewState(
      <Thread thread={thread} interactive={false} />
    );

    expect(queryByText('Refers to a deleted element')).not.toBeInTheDocument();
  });

  it('renders the hint above the first comment', () => {
    const {getByText} = renderWithReviewState(
      <Thread thread={{...thread, orphaned: true}} interactive={false} />
    );

    const hint = getByText('Refers to a deleted element');
    const comment = getByText('On the pull quote');

    expect(hint.compareDocumentPosition(comment) & Node.DOCUMENT_POSITION_FOLLOWING)
      .toBeTruthy();
  });
});
