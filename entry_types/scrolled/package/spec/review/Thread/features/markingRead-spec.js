import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {act} from '@testing-library/react';
import {useFakeTranslations} from 'pageflow/testHelpers';

import {Thread} from 'review/Thread';
import {renderWithReviewState} from 'support/renderWithReviewState';
import {
  simulateScrollingIntoView,
  simulateScrollingOutOfView
} from 'support/fakeIntersectionObserver';

describe('Thread marking read', () => {
  useFakeTranslations({
    'pageflow_scrolled.review.reply_placeholder': 'Reply...',
    'pageflow_scrolled.review.reply_count.one': '1 reply',
    'pageflow_scrolled.review.reply_count.other': '%{count} replies',
  });

  const currentUser = {id: 42, name: 'Alice'};

  const thread = {
    id: 1,
    permaId: 5,
    subjectType: 'ContentElement',
    subjectId: 10,
    comments: [
      {
        id: 100,
        body: 'On the pull quote',
        creatorId: 43,
        creatorName: 'Bob',
        createdAt: '2026-08-17T11:00:00.000Z'
      }
    ]
  };

  const threadWithReply = {
    ...thread,
    comments: [
      ...thread.comments,
      {
        id: 101,
        body: 'Agreed',
        creatorId: 44,
        creatorName: 'Carol',
        createdAt: '2026-08-17T12:00:00.000Z'
      }
    ]
  };

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  function render(ui, options) {
    const postMessage = jest.spyOn(window.top, 'postMessage').mockImplementation(() => {});

    return {
      ...renderWithReviewState(ui, {currentUser, commentThreads: [thread], ...options}),
      postMessage
    };
  }

  function passTime(ms) {
    act(() => {
      jest.advanceTimersByTime(ms);
    });
  }

  function markReadMessages(postMessage) {
    return postMessage.mock.calls.filter(([message]) => message.type === 'MARK_THREADS_READ');
  }

  it('marks thread read once it has been on screen long enough', () => {
    const {container, postMessage} = render(<Thread thread={thread} />);

    simulateScrollingIntoView(container);
    passTime(1000);

    expect(postMessage).toHaveBeenCalledWith(
      {type: 'MARK_THREADS_READ', payload: {permaIds: [5]}},
      window.location.origin
    );
  });

  it('does not mark thread read while it is off screen', () => {
    const {postMessage} = render(<Thread thread={thread} />);

    passTime(1000);

    expect(markReadMessages(postMessage)).toEqual([]);
  });

  it('does not mark thread read when it scrolls by', () => {
    const {container, postMessage} = render(<Thread thread={thread} />);

    simulateScrollingIntoView(container);
    passTime(400);
    simulateScrollingOutOfView(container);
    passTime(1000);

    expect(markReadMessages(postMessage)).toEqual([]);
  });

  it('does not mark thread read while replies are collapsed', () => {
    const {container, postMessage} = render(
      <Thread thread={threadWithReply} collapsed />,
      {commentThreads: [threadWithReply]}
    );

    simulateScrollingIntoView(container);
    passTime(1000);

    expect(markReadMessages(postMessage)).toEqual([]);
  });

  it('marks thread read once replies are expanded', () => {
    const {container, postMessage} = render(
      <Thread thread={threadWithReply} />,
      {commentThreads: [threadWithReply]}
    );

    simulateScrollingIntoView(container);
    passTime(1000);

    expect(markReadMessages(postMessage)).toHaveLength(1);
  });

  it('does not mark thread read while it is not the highlighted one', () => {
    const {container, postMessage} = render(
      <Thread thread={thread} markReadWhenHighlighted />
    );

    simulateScrollingIntoView(container);
    passTime(1000);

    expect(markReadMessages(postMessage)).toEqual([]);
  });

  it('marks thread read once it is the highlighted one', () => {
    const {container, postMessage} = render(
      <Thread thread={thread} markReadWhenHighlighted highlighted />
    );

    simulateScrollingIntoView(container);
    passTime(1000);

    expect(markReadMessages(postMessage)).toHaveLength(1);
  });

  it('marks thread read once a resolution by someone else has been seen', () => {
    const resolved = {
      ...thread,
      resolvedAt: '2026-08-17T13:00:00.000Z',
      resolvedById: 44
    };

    const {container, postMessage} = render(
      <Thread thread={resolved} />,
      {
        commentThreads: [resolved],
        commentThreadReads: {5: '2026-08-17T12:00:00.000Z'}
      }
    );

    simulateScrollingIntoView(container);
    passTime(1000);

    expect(markReadMessages(postMessage)).toHaveLength(1);
  });

  it('does not mark thread read again once all comments have been read', () => {
    const {container, postMessage} = render(
      <Thread thread={thread} />,
      {commentThreadReads: {5: '2026-08-17T13:00:00.000Z'}}
    );

    simulateScrollingIntoView(container);
    passTime(1000);

    expect(markReadMessages(postMessage)).toEqual([]);
  });

  it('does not mark thread read that only contains own comments', () => {
    const ownThread = {
      ...thread,
      comments: [{...thread.comments[0], creatorId: currentUser.id, creatorName: 'Alice'}]
    };

    const {container, postMessage} = render(
      <Thread thread={ownThread} />,
      {commentThreads: [ownThread]}
    );

    simulateScrollingIntoView(container);
    passTime(1000);

    expect(markReadMessages(postMessage)).toEqual([]);
  });

  it('does not mark thread read before current user is known', () => {
    const {container, postMessage} = render(
      <Thread thread={thread} />,
      {currentUser: null}
    );

    simulateScrollingIntoView(container);
    passTime(1000);

    expect(markReadMessages(postMessage)).toEqual([]);
  });
});
