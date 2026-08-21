import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {useFakeTranslations} from 'pageflow/testHelpers';

import {Thread} from 'review/Thread';
import {renderWithReviewState} from 'support/renderWithReviewState';

describe('Thread new replies divider', () => {
  useFakeTranslations({
    'pageflow_scrolled.review.reply_placeholder': 'Reply...',
    'pageflow_scrolled.review.reply_count.one': '1 reply',
    'pageflow_scrolled.review.reply_count.other': '%{count} replies',
    'pageflow_scrolled.review.toggle_replies': 'Toggle replies',
    'pageflow_scrolled.review.new_replies': 'New replies'
  });

  const currentUser = {id: 42, name: 'Alice'};

  function comment(attributes) {
    return {creatorId: 43, creatorName: 'Bob', ...attributes};
  }

  const thread = {
    id: 1,
    permaId: 5,
    subjectType: 'ContentElement',
    subjectId: 10,
    comments: [
      comment({id: 100, body: 'On the pull quote', createdAt: '2026-08-17T09:00:00.000Z'}),
      comment({id: 101, body: 'Older reply', createdAt: '2026-08-17T09:30:00.000Z'}),
      comment({
        id: 102, body: 'Newer reply', creatorId: 44, creatorName: 'Carol',
        createdAt: '2026-08-17T11:00:00.000Z'
      })
    ]
  };

  function render(options = {}) {
    return renderWithReviewState(
      <Thread thread={thread} />,
      {currentUser, commentThreads: [thread], ...options}
    );
  }

  it('separates unseen replies from the ones already seen', () => {
    const {getByText} = render({commentThreadReads: {5: '2026-08-17T10:00:00.000Z'}});

    const divider = getByText('New replies');
    const seen = getByText('Older reply');
    const unseen = getByText('Newer reply');

    expect(divider.compareDocumentPosition(seen) & Node.DOCUMENT_POSITION_PRECEDING)
      .toBeTruthy();
    expect(divider.compareDocumentPosition(unseen) & Node.DOCUMENT_POSITION_FOLLOWING)
      .toBeTruthy();
  });

  it('renders no divider when every reply has been seen', () => {
    const {queryByText} = render({commentThreadReads: {5: '2026-08-17T12:00:00.000Z'}});

    expect(queryByText('New replies')).toBeNull();
  });

  // The thread's own marker already says the whole thread is new.
  it('renders no divider when the thread is new all through', () => {
    const {queryByText} = render();

    expect(queryByText('New replies')).toBeNull();
  });

  it('renders no divider while replies are collapsed', () => {
    const {queryByText} = renderWithReviewState(
      <Thread thread={thread} collapsed />,
      {
        currentUser,
        commentThreads: [thread],
        commentThreadReads: {5: '2026-08-17T10:00:00.000Z'}
      }
    );

    expect(queryByText('New replies')).toBeNull();
  });

  it('renders no divider before the current user own replies', () => {
    const threadWithOwnReply = {
      ...thread,
      comments: [
        thread.comments[0],
        thread.comments[1],
        comment({
          id: 102, body: 'Will fix', creatorId: currentUser.id, creatorName: 'Alice',
          createdAt: '2026-08-17T11:00:00.000Z'
        })
      ]
    };

    const {queryByText} = renderWithReviewState(
      <Thread thread={threadWithOwnReply} />,
      {
        currentUser,
        commentThreads: [threadWithOwnReply],
        commentThreadReads: {5: '2026-08-17T10:00:00.000Z'}
      }
    );

    expect(queryByText('New replies')).toBeNull();
  });
});
