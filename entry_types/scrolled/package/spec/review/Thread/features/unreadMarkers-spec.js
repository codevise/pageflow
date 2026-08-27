import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {useFakeTranslations} from 'pageflow/testHelpers';

import {Thread} from 'review/Thread';
import {renderWithReviewState} from 'support/renderWithReviewState';
import styles from 'review/Thread.module.css';

describe('Thread unread markers', () => {
  useFakeTranslations({
    'pageflow_scrolled.review.reply_placeholder': 'Reply...',
    'pageflow_scrolled.review.reply_count.one': '1 reply',
    'pageflow_scrolled.review.reply_count.other': '%{count} replies',
    'pageflow_scrolled.review.unread_reply_count.one': '1 unread',
    'pageflow_scrolled.review.unread_reply_count.other': '%{count} unread',
    'pageflow_scrolled.review.unread_comment_count.one': '1 unread comment',
    'pageflow_scrolled.review.unread_comment_count.other': '%{count} unread comments'
  });

  const currentUser = {id: 42, name: 'Alice'};

  function comment(attributes) {
    return {
      creatorId: 43,
      creatorName: 'Bob',
      createdAt: '2026-08-17T11:00:00.000Z',
      ...attributes
    };
  }

  const thread = {
    id: 1,
    permaId: 5,
    subjectType: 'ContentElement',
    subjectId: 10,
    comments: [comment({id: 100, body: 'On the pull quote'})]
  };

  const threadWithReplies = {
    ...thread,
    comments: [
      comment({
        id: 100, body: 'On the pull quote', createdAt: '2026-08-17T09:00:00.000Z'
      }),
      comment({id: 101, body: 'Agreed', creatorId: 44, creatorName: 'Carol'})
    ]
  };

  function render(ui, options = {}) {
    return renderWithReviewState(ui, {currentUser, commentThreads: [thread], ...options});
  }

  function unreadDot(container) {
    return container.querySelector(`.${styles.unreadDot}`);
  }

  describe('dot on the thread', () => {
    it('marks a thread with unseen comments', () => {
      const {container, getByLabelText} = render(
        <Thread thread={thread} showUnreadMarker />
      );

      expect(unreadDot(container)).not.toBeNull();
      expect(getByLabelText('1 unread comment')).toBeInTheDocument();
    });

    it('marks a thread whose replies are unseen', () => {
      const {container} = render(
        <Thread thread={threadWithReplies} showUnreadMarker />,
        {
          commentThreads: [threadWithReplies],
          commentThreadReads: {5: '2026-08-17T10:00:00.000Z'}
        }
      );

      expect(unreadDot(container)).not.toBeNull();
    });

    it('does not mark a thread without unseen comments', () => {
      const {container} = render(
        <Thread thread={thread} showUnreadMarker />,
        {commentThreadReads: {5: '2026-08-17T12:00:00.000Z'}}
      );

      expect(unreadDot(container)).toBeNull();
    });

    // The badge that opened the list already carries the same information.
    it('does not mark a thread shown on its own', () => {
      const {container} = render(<Thread thread={thread} />);

      expect(unreadDot(container)).toBeNull();
    });
  });

  describe('outline on the thread', () => {
    function outlined(container) {
      return container.querySelector(`.${styles.unreadTopic}`);
    }

    it('outlines a thread whose topic is unseen', () => {
      const {container} = render(<Thread thread={thread} showUnreadMarker />);

      expect(outlined(container)).not.toBeNull();
    });

    it('leaves a thread whose replies are unseen unoutlined', () => {
      const {container} = render(
        <Thread thread={threadWithReplies} showUnreadMarker />,
        {
          commentThreads: [threadWithReplies],
          commentThreadReads: {5: '2026-08-17T10:00:00.000Z'}
        }
      );

      expect(outlined(container)).toBeNull();
    });

    it('leaves a thread without unseen comments unoutlined', () => {
      const {container} = render(
        <Thread thread={thread} showUnreadMarker />,
        {commentThreadReads: {5: '2026-08-17T12:00:00.000Z'}}
      );

      expect(outlined(container)).toBeNull();
    });

    it('leaves a thread shown on its own unoutlined', () => {
      const {container} = render(<Thread thread={thread} />);

      expect(outlined(container)).toBeNull();
    });
  });

  describe('new reply count', () => {
    it('counts unseen replies hidden by collapsing', () => {
      const {getByText} = render(
        <Thread thread={threadWithReplies} collapsed showUnreadMarker />,
        {
          commentThreads: [threadWithReplies],
          commentThreadReads: {5: '2026-08-17T10:00:00.000Z'}
        }
      );

      expect(getByText('1 reply')).toBeInTheDocument();
      expect(getByText('1 unread')).toBeInTheDocument();
    });

    // An unread first comment must not be counted among the replies it
    // is collapsed above, and own replies are never new.
    it('counts neither the first comment nor own replies', () => {
      const threadWithOwnReply = {
        ...thread,
        comments: [
          comment({id: 100, body: 'On the pull quote'}),
          comment({id: 101, body: 'Will fix', creatorId: currentUser.id, creatorName: 'Alice'})
        ]
      };

      const {getByText, queryByText} = render(
        <Thread thread={threadWithOwnReply} collapsed showUnreadMarker />,
        {commentThreads: [threadWithOwnReply]}
      );

      expect(getByText('1 reply')).toBeInTheDocument();
      expect(queryByText('1 unread')).toBeNull();
    });

    it('does not show a count when all replies have been seen', () => {
      const {queryByText} = render(
        <Thread thread={threadWithReplies} collapsed showUnreadMarker />,
        {
          commentThreads: [threadWithReplies],
          commentThreadReads: {5: '2026-08-17T13:00:00.000Z'}
        }
      );

      expect(queryByText('1 reply')).toBeInTheDocument();
      expect(queryByText('1 unread')).toBeNull();
    });
  });
});
