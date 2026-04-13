import React from 'react';
import '@testing-library/jest-dom/extend-expect';

import {CommentBadge} from 'review/CommentBadge';
import {renderWithReviewState} from 'testHelpers/renderWithReviewState';

describe('CommentBadge', () => {
  it('displays thread count for subject', () => {
    const {getByRole} = renderWithReviewState(
      <CommentBadge subjectType="ContentElement" subjectId={10} />,
      {
        commentThreads: [
          {id: 1, subjectType: 'ContentElement', subjectId: 10, comments: []},
          {id: 2, subjectType: 'ContentElement', subjectId: 10, comments: []},
          {id: 3, subjectType: 'ContentElement', subjectId: 20, comments: []}
        ]
      }
    );

    expect(getByRole('status')).toHaveTextContent('2');
  });

  it('renders nothing when no threads exist for subject', () => {
    const {container} = renderWithReviewState(
      <CommentBadge subjectType="ContentElement" subjectId={10} />
    );

    expect(container).toBeEmptyDOMElement();
  });
});
