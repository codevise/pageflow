import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import {useFakeTranslations} from 'pageflow/testHelpers';

import {Thread} from 'review/Thread';
import styles from 'review/Thread.module.css';
import {renderWithReviewState} from 'support/renderWithReviewState';

describe('Thread resolution', () => {
  useFakeTranslations({
    'pageflow_scrolled.review.resolution': 'Marked as resolved',
    'pageflow_scrolled.review.resolution_by': 'Marked as resolved by',
    'pageflow_scrolled.review.resolve': 'Mark as resolved',
    'pageflow_scrolled.review.unresolve': 'Mark as unresolved',
    'pageflow_scrolled.review.thread_actions': 'Thread actions',
    'pageflow_scrolled.review.reply_placeholder': 'Reply...',
    'pageflow_scrolled.review.send': 'Send',
    'pageflow_scrolled.review.enter_for_new_line': 'Enter for new line'
  });

  const thread = {
    id: 1,
    comments: [{id: 10, body: 'On the pull quote', creatorName: 'Bob', creatorId: 2}]
  };

  const withReply = {
    ...thread,
    comments: [...thread.comments,
               {id: 11, body: 'A reply', creatorName: 'Carol', creatorId: 3}]
  };

  const resolvedWithReply = {
    ...withReply,
    resolvedAt: '2026-08-19T10:00:00.000Z',
    resolvedById: 3,
    resolverName: 'Ada'
  };

  const resolved = {
    ...thread,
    resolvedAt: '2026-08-19T10:00:00.000Z',
    resolvedById: 3,
    resolverName: 'Ada'
  };

  describe('unread', () => {
    const currentUser = {id: 42, name: 'Alice'};

    const tracked = {...resolved, permaId: 5};

    function renderResolved(thread, options) {
      return renderWithReviewState(
        <Thread thread={thread} interactive={false} />,
        {currentUser, commentThreads: [thread], ...options}
      );
    }

    function resolveRow(container) {
      return container.querySelector(`.${styles.resolveRow}`);
    }

    it('marks the line while the resolution has not been seen', () => {
      const {container} = renderResolved(tracked, {commentThreadReads: {}});

      expect(resolveRow(container)).toHaveClass(styles.unreadResolution);
    });

    it('leaves the line alone once the resolution has been seen', () => {
      const {container} = renderResolved(tracked, {
        commentThreadReads: {5: '2026-08-19T11:00:00.000Z'}
      });

      expect(resolveRow(container)).not.toHaveClass(styles.unreadResolution);
    });

    it('leaves the line alone for the reviewer resolving it themselves', () => {
      const {container} = renderResolved(
        {...tracked, resolvedById: currentUser.id},
        {commentThreadReads: {}}
      );

      expect(resolveRow(container)).not.toHaveClass(styles.unreadResolution);
    });
  });

  it('names the user who resolved the thread', () => {
    const {getByText} = renderWithReviewState(
      <Thread thread={resolved} interactive={false} />
    );

    expect(getByText('Marked as resolved by')).toBeInTheDocument();
    expect(getByText('Ada')).toBeInTheDocument();
  });

  it('renders the time the thread was resolved', () => {
    const {container} = renderWithReviewState(
      <Thread thread={resolved} interactive={false} />
    );

    expect(container.querySelector('time[datetime="2026-08-19T10:00:00.000Z"]'))
      .toBeInTheDocument();
  });

  it('says a thread was resolved even when the resolver is not known', () => {
    const {getByText, queryByText} = renderWithReviewState(
      <Thread thread={{...resolved, resolvedById: undefined, resolverName: undefined}}
              interactive={false} />
    );

    expect(getByText('Marked as resolved')).toBeInTheDocument();
    expect(queryByText('Marked as resolved by')).toBeNull();
  });

  it('does not render a resolution for an unresolved thread', () => {
    const {queryByText} = renderWithReviewState(
      <Thread thread={thread} onResolve={() => {}} />
    );

    expect(queryByText('Marked as resolved by')).toBeNull();
    expect(queryByText('Marked as resolved')).toBeNull();
  });

  it('replaces the resolve button once the thread is resolved', () => {
    const {queryByRole} = renderWithReviewState(
      <Thread thread={resolved} onResolve={() => {}} />
    );

    expect(queryByRole('button', {name: 'Mark as resolved'})).toBeNull();
  });

  it('offers the resolve button while the thread is unresolved', () => {
    const {getByRole} = renderWithReviewState(
      <Thread thread={thread} onResolve={() => {}} />
    );

    expect(getByRole('button', {name: 'Mark as resolved'})).toBeInTheDocument();
  });

  it('says a collapsed thread is resolved', () => {
    const {getByText} = renderWithReviewState(
      <Thread thread={resolvedWithReply} collapsed interactive={false} />
    );

    expect(getByText('Marked as resolved by')).toBeInTheDocument();
    expect(getByText('Ada')).toBeInTheDocument();
  });

  it('undoes the resolution of a collapsed thread as well', () => {
    const {getByRole} = renderWithReviewState(
      <Thread thread={resolvedWithReply} collapsed onResolve={() => {}} />
    );

    expect(getByRole('button', {name: 'Thread actions'})).toBeInTheDocument();
  });

  it('offers no resolve button while collapsed', () => {
    const {queryByRole} = renderWithReviewState(
      <Thread thread={withReply} collapsed onResolve={() => {}} />
    );

    expect(queryByRole('button', {name: 'Mark as resolved'})).toBeNull();
  });

  it('undoes the resolution through a menu', async () => {
    const user = userEvent.setup();
    const onResolve = jest.fn();

    const {getByRole} = renderWithReviewState(
      <Thread thread={resolved} onResolve={onResolve} />
    );

    await user.click(getByRole('button', {name: 'Thread actions'}));
    await user.click(getByRole('menuitem', {name: 'Mark as unresolved'}));

    expect(onResolve).toHaveBeenCalled();
  });

  it('renders no menu without a way to resolve', () => {
    const {getByText, queryByRole} = renderWithReviewState(
      <Thread thread={resolved} interactive={false} />
    );

    expect(getByText('Ada')).toBeInTheDocument();
    expect(queryByRole('button', {name: 'Thread actions'})).toBeNull();
  });
});
