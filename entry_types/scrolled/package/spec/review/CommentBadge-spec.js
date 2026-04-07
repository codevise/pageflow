import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {render, act} from '@testing-library/react';

import {ReviewStateProvider} from 'review/ReviewStateProvider';
import {CommentBadge} from 'review/CommentBadge';

describe('CommentBadge', () => {
  it('displays thread count for subject', () => {
    const {getByRole} = render(
      <ReviewStateProvider>
        <CommentBadge subjectType="ContentElement" subjectId={10} />
      </ReviewStateProvider>
    );

    act(() => {
      window.dispatchEvent(new MessageEvent('message', {
        data: {
          type: 'REVIEW_STATE_RESET',
          payload: {
            currentUser: {id: 1},
            commentThreads: [
              {id: 1, subjectType: 'ContentElement', subjectId: 10, comments: []},
              {id: 2, subjectType: 'ContentElement', subjectId: 10, comments: []},
              {id: 3, subjectType: 'ContentElement', subjectId: 20, comments: []}
            ]
          }
        },
        origin: window.location.origin
      }));
    });

    expect(getByRole('status')).toHaveTextContent('2');
  });

  it('renders nothing when no threads exist for subject', () => {
    const {container} = render(
      <ReviewStateProvider>
        <CommentBadge subjectType="ContentElement" subjectId={10} />
      </ReviewStateProvider>
    );

    expect(container).toBeEmptyDOMElement();
  });
});
