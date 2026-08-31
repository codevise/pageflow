import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import {act} from '@testing-library/react';
import {useFakeTranslations} from 'pageflow/testHelpers';

import {Thread} from 'review/Thread';
import {renderWithReviewState} from 'support/renderWithReviewState';
import {
  simulateScrollingIntoView
} from 'support/fakeIntersectionObserver';

describe('Thread folded replies', () => {
  useFakeTranslations({
    'pageflow_scrolled.review.reply_placeholder': 'Reply...',
    'pageflow_scrolled.review.reply_count.one': '1 reply',
    'pageflow_scrolled.review.reply_count.other': '%{count} replies',
    'pageflow_scrolled.review.earlier_reply_count.one': '1 more',
    'pageflow_scrolled.review.earlier_reply_count.other': '%{count} more',
    'pageflow_scrolled.review.unread_replies': 'Unread replies'
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
      comment({id: 101, body: 'First reply', createdAt: '2026-08-17T09:30:00.000Z'}),
      comment({id: 102, body: 'Second reply', createdAt: '2026-08-17T10:00:00.000Z'}),
      comment({id: 103, body: 'Third reply', createdAt: '2026-08-17T10:30:00.000Z'})
    ]
  };

  function render(ui, options = {}) {
    return renderWithReviewState(ui, {currentUser, commentThreads: [thread], ...options});
  }

  it('shows the opening comment and the last replies asked for', () => {
    const {getByText, queryByText} = render(
      <Thread thread={thread} visibleReplyCount={1} />
    );

    expect(getByText('On the pull quote')).toBeInTheDocument();
    expect(getByText('Third reply')).toBeInTheDocument();
    expect(queryByText('First reply')).toBeNull();
    expect(queryByText('Second reply')).toBeNull();
  });

  it('counts the folded replies between them', () => {
    const {getByText} = render(<Thread thread={thread} visibleReplyCount={1} />);

    expect(getByText('2 more')).toBeInTheDocument();
  });

  it('folds every reply away when none are asked for', () => {
    const {getByText, queryByText} = render(
      <Thread thread={thread} visibleReplyCount={0} />
    );

    expect(getByText('On the pull quote')).toBeInTheDocument();
    expect(getByText('3 more')).toBeInTheDocument();
    expect(queryByText('Third reply')).toBeNull();
  });

  it('offers no reply count toggle while replies are folded', () => {
    const {queryByRole} = render(<Thread thread={thread} visibleReplyCount={1} />);

    expect(queryByRole('button', {name: /3 replies/})).toBeNull();
  });

  it('offers the reply count toggle once nothing is folded', () => {
    const {getByRole} = render(<Thread thread={thread} />);

    expect(getByRole('button', {name: /3 replies/})).toBeInTheDocument();
  });

  it('offers the reply count toggle after expanding the folded replies', async () => {
    const user = userEvent.setup();

    function ExpandingThread() {
      const [expanded, setExpanded] = React.useState(false);

      return (
        <Thread thread={thread}
                visibleReplyCount={expanded ? undefined : 1}
                onExpandReplies={() => setExpanded(true)} />
      );
    }

    const {getByRole, queryByRole} = render(<ExpandingThread />);

    expect(queryByRole('button', {name: /3 replies/})).toBeNull();

    await user.click(getByRole('button', {name: '2 more'}));

    expect(getByRole('button', {name: /3 replies/})).toBeInTheDocument();
  });

  it('offers the reply count toggle while collapsed with folded replies', () => {
    const {getByRole} = render(
      <Thread thread={thread} visibleReplyCount={1} collapsed />
    );

    expect(getByRole('button', {name: /3 replies/})).toBeInTheDocument();
  });

  it('shows every reply without a visible count', () => {
    const {getByText, queryByText} = render(<Thread thread={thread} />);

    expect(getByText('First reply')).toBeInTheDocument();
    expect(getByText('Third reply')).toBeInTheDocument();
    expect(queryByText('2 more')).toBeNull();
  });

  it('folds nothing when the count covers every reply', () => {
    const {getByText, queryByText} = render(
      <Thread thread={thread} visibleReplyCount={3} />
    );

    expect(getByText('First reply')).toBeInTheDocument();
    expect(queryByText('1 more')).toBeNull();
  });

  it('reports the fold marker being clicked', async () => {
    const user = userEvent.setup();
    const onExpandReplies = jest.fn();

    const {getByRole} = render(
      <Thread thread={thread} visibleReplyCount={1} onExpandReplies={onExpandReplies} />
    );

    await user.click(getByRole('button', {name: '2 more'}));

    expect(onExpandReplies).toHaveBeenCalled();
  });

  it('does not offer the marker as a button without a handler', () => {
    const {queryByRole, getByText} = render(
      <Thread thread={thread} visibleReplyCount={1} />
    );

    expect(getByText('2 more')).toBeInTheDocument();
    expect(queryByRole('button', {name: '2 more'})).toBeNull();
  });

  it('hides the reply form while replies are folded away', () => {
    const {queryByPlaceholderText} = render(
      <Thread thread={thread} visibleReplyCount={1} />
    );

    expect(queryByPlaceholderText('Reply...')).toBeNull();
  });

  it('offers the reply form once nothing is folded away', () => {
    const {getByPlaceholderText} = render(
      <Thread thread={thread} visibleReplyCount={3} />
    );

    expect(getByPlaceholderText('Reply...')).toBeInTheDocument();
  });

  describe('marking read', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
      jest.restoreAllMocks();
    });

    function renderWithPostMessage(ui, options) {
      const postMessage = jest.spyOn(window.top, 'postMessage').mockImplementation(() => {});

      return {...render(ui, options), postMessage};
    }

    function markReadMessages(postMessage) {
      return postMessage.mock.calls.filter(([message]) => message.type === 'MARK_THREADS_READ');
    }

    it('does not mark the thread read while replies are folded away', () => {
      const {container, postMessage} = renderWithPostMessage(
        <Thread thread={thread} visibleReplyCount={1} />
      );

      simulateScrollingIntoView(container);
      act(() => jest.advanceTimersByTime(1000));

      expect(markReadMessages(postMessage)).toEqual([]);
    });

    it('marks the thread read when the replies folded away have been read', () => {
      const {container, postMessage} = renderWithPostMessage(
        <Thread thread={thread} visibleReplyCount={1} />,
        {commentThreadReads: {5: '2026-08-17T10:15:00.000Z'}}
      );

      simulateScrollingIntoView(container);
      act(() => jest.advanceTimersByTime(1000));

      expect(markReadMessages(postMessage)).toHaveLength(1);
    });

    it('marks the thread read once nothing is folded away', () => {
      const {container, postMessage} = renderWithPostMessage(
        <Thread thread={thread} visibleReplyCount={3} />
      );

      simulateScrollingIntoView(container);
      act(() => jest.advanceTimersByTime(1000));

      expect(markReadMessages(postMessage)).toHaveLength(1);
    });
  });
});
