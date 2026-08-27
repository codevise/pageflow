import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import {useFakeTranslations} from 'pageflow/testHelpers';

import {Thread} from 'review/Thread';
import avatarStyles from 'review/Avatar.module.css';
import {renderWithReviewState} from 'support/renderWithReviewState';

describe('Thread reply toggle', () => {
  useFakeTranslations({
    'pageflow_scrolled.review.reply_count.one': '1 reply',
    'pageflow_scrolled.review.reply_count.other': '%{count} replies',
    'pageflow_scrolled.review.reply_placeholder': 'Reply...',
    'pageflow_scrolled.review.send': 'Send',
    'pageflow_scrolled.review.enter_for_new_line': 'Enter for new line'
  });

  const thread = {
    id: 1,
    comments: [
      {id: 10, body: 'A topic', creatorName: 'Bob', creatorId: 2},
      {id: 11, body: 'A reply', creatorName: 'Carol', creatorId: 3},
      {id: 12, body: 'Another reply', creatorName: 'Dave', creatorId: 4}
    ]
  };

  const withoutReplies = {id: 1, comments: [thread.comments[0]]};

  it('renders no toggle for a thread without replies', () => {
    const {queryByRole} = renderWithReviewState(
      <Thread thread={withoutReplies} interactive={false} />
    );

    expect(queryByRole('button', {name: /repl/})).toBeNull();
  });

  it('counts the replies', () => {
    const {getByRole} = renderWithReviewState(
      <Thread thread={thread} collapsed interactive={false} />
    );

    expect(getByRole('button', {name: /2 replies/})).toBeInTheDocument();
  });

  it('keeps the count once the replies are shown', () => {
    const {getByRole} = renderWithReviewState(
      <Thread thread={thread} interactive={false} />
    );

    expect(getByRole('button', {name: /2 replies/})).toBeInTheDocument();
  });

  it('toggles the thread', async () => {
    const user = userEvent.setup();
    const onToggle = jest.fn();

    const {getByRole} = renderWithReviewState(
      <Thread thread={thread} collapsed onToggle={onToggle} interactive={false} />
    );

    await user.click(getByRole('button', {name: /2 replies/}));

    expect(onToggle).toHaveBeenCalled();
  });

  it('exposes that the replies are hidden', () => {
    const {getByRole} = renderWithReviewState(
      <Thread thread={thread} collapsed interactive={false} />
    );

    expect(getByRole('button', {name: /2 replies/}))
      .toHaveAttribute('aria-expanded', 'false');
  });

  it('exposes that the replies are shown', () => {
    const {getByRole} = renderWithReviewState(
      <Thread thread={thread} interactive={false} />
    );

    expect(getByRole('button', {name: /2 replies/}))
      .toHaveAttribute('aria-expanded', 'true');
  });

  it('shows who replied while the replies are hidden', () => {
    const {container} = renderWithReviewState(
      <Thread thread={thread} collapsed interactive={false} />
    );

    expect(container.querySelector(`.${avatarStyles.avatarStack}`))
      .toBeInTheDocument();
  });

  it('hides who replied once the replies are shown', () => {
    const {container} = renderWithReviewState(
      <Thread thread={thread} interactive={false} />
    );

    expect(container.querySelector(`.${avatarStyles.avatarStack}`)).toBeNull();
  });
});
