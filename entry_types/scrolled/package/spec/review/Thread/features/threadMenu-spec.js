import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import {useFakeTranslations} from 'pageflow/testHelpers';

import {Thread} from 'review/Thread';
import {renderWithReviewState} from 'support/renderWithReviewState';

describe('Thread menu', () => {
  useFakeTranslations({
    'pageflow_scrolled.review.thread_actions': 'Topic actions',
    'pageflow_scrolled.review.watch_thread': 'Watch topic',
    'pageflow_scrolled.review.mute_thread': 'Mute topic'
  });

  const currentUser = {id: 42, name: 'Alice'};

  function thread(attributes) {
    return {
      id: 1,
      permaId: 5,
      comments: [{id: 100, body: 'A topic', creatorName: 'Bob', creatorId: 43}],
      ...attributes
    };
  }

  function render(ui) {
    const postMessage = jest.spyOn(window.top, 'postMessage').mockImplementation(() => {});
    postMessage.mockClear();

    return {...renderWithReviewState(ui, {currentUser}), postMessage};
  }

  function notificationLevelMessages(postMessage) {
    return postMessage.mock.calls
                      .map(([message]) => message)
                      .filter(message => message.type === 'UPDATE_THREAD_NOTIFICATION_LEVEL');
  }

  it('offers muting a topic the user is not muting yet', async () => {
    const user = userEvent.setup();
    const {getByRole, postMessage} = render(
      <Thread thread={thread({notificationLevel: 'all_activity'})} />
    );

    await user.click(getByRole('button', {name: 'Topic actions'}));
    await user.click(getByRole('menuitem', {name: 'Mute topic'}));

    expect(notificationLevelMessages(postMessage)).toEqual([
      {type: 'UPDATE_THREAD_NOTIFICATION_LEVEL', payload: {threadId: 1, level: 'muted'}}
    ]);
  });

  it('offers watching a muted topic', async () => {
    const user = userEvent.setup();
    const {getByRole, postMessage} = render(
      <Thread thread={thread({notificationLevel: 'muted'})} />
    );

    await user.click(getByRole('button', {name: 'Topic actions'}));
    await user.click(getByRole('menuitem', {name: 'Watch topic'}));

    expect(notificationLevelMessages(postMessage)).toEqual([
      {type: 'UPDATE_THREAD_NOTIFICATION_LEVEL', payload: {threadId: 1, level: 'all_activity'}}
    ]);
  });

  it('offers only muting where the rungs below already notify', async () => {
    const user = userEvent.setup();
    const {getByRole, queryByRole} = render(
      <Thread thread={thread({
        notificationLevel: 'participating_threads',
        comments: [
          {id: 100, body: 'A topic', creatorName: 'Bob', creatorId: 43},
          {id: 101, body: 'A reply', creatorName: 'Alice', creatorId: currentUser.id}
        ]
      })} />
    );

    await user.click(getByRole('button', {name: 'Topic actions'}));

    expect(getByRole('menuitem', {name: 'Mute topic'})).toBeInTheDocument();
    expect(queryByRole('menuitem', {name: 'Watch topic'})).toBeNull();
  });

  it('offers only watching where the rungs below do not notify', async () => {
    const user = userEvent.setup();
    const {getByRole, queryByRole} = render(
      <Thread thread={thread({notificationLevel: 'participating_threads'})} />
    );

    await user.click(getByRole('button', {name: 'Topic actions'}));

    expect(getByRole('menuitem', {name: 'Watch topic'})).toBeInTheDocument();
    expect(queryByRole('menuitem', {name: 'Mute topic'})).toBeNull();
  });

  it('leaves the menu out where the thread is not interactive', () => {
    const {queryByRole} = render(
      <Thread thread={thread({notificationLevel: 'all_activity'})} interactive={false} />
    );

    expect(queryByRole('button', {name: 'Topic actions'})).toBeNull();
  });

  it('carries the menu on a topic written by somebody else', async () => {
    const user = userEvent.setup();
    const {getByRole} = render(
      <Thread thread={thread({notificationLevel: 'all_activity'})} />
    );

    await user.click(getByRole('button', {name: 'Topic actions'}));

    expect(getByRole('menuitem', {name: 'Mute topic'})).toBeInTheDocument();
  });
});
