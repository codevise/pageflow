import BackboneEvents from 'backbone-events-standalone';

import {ReviewMessageHandler} from 'review/ReviewMessageHandler';

function fakeReviewSession() {
  const session = {
    createThread: jest.fn().mockResolvedValue(),
    createComment: jest.fn().mockResolvedValue()
  };

  Object.assign(session, BackboneEvents);
  return session;
}

describe('ReviewMessageHandler', () => {
  it('calls session.createThread on CREATE_COMMENT_THREAD message from targetWindow', async () => {
    const session = fakeReviewSession();

    ReviewMessageHandler.create({session, targetWindow: window});

    window.dispatchEvent(new MessageEvent('message', {
      data: {
        type: 'CREATE_COMMENT_THREAD',
        payload: {subjectType: 'CE', subjectId: 10, body: 'Test'}
      },
      origin: window.location.origin,
      source: window
    }));

    await new Promise(resolve => setTimeout(resolve, 0));

    expect(session.createThread).toHaveBeenCalledWith({
      subjectType: 'CE', subjectId: 10, body: 'Test'
    });
  });

  it('calls session.createComment on CREATE_COMMENT message from targetWindow', async () => {
    const session = fakeReviewSession();

    ReviewMessageHandler.create({session, targetWindow: window});

    window.dispatchEvent(new MessageEvent('message', {
      data: {
        type: 'CREATE_COMMENT',
        payload: {threadId: 1, body: 'Reply'}
      },
      origin: window.location.origin,
      source: window
    }));

    await new Promise(resolve => setTimeout(resolve, 0));

    expect(session.createComment).toHaveBeenCalledWith({
      threadId: 1, body: 'Reply'
    });
  });

  it('posts REVIEW_STATE_RESET to target window on session reset', () => {
    const session = fakeReviewSession();
    const postMessage = jest.fn();
    jest.spyOn(window, 'postMessage').mockImplementation(postMessage);

    ReviewMessageHandler.create({session, targetWindow: window});

    const state = {currentUser: {id: 42}, commentThreads: [{id: 1}]};
    session.trigger('reset', state);

    expect(postMessage).toHaveBeenCalledWith(
      {type: 'REVIEW_STATE_RESET', payload: state},
      window.location.origin
    );

    window.postMessage.mockRestore();
  });

  it('posts REVIEW_STATE_THREAD_CHANGE to target window on session change:thread', () => {
    const session = fakeReviewSession();
    const postMessage = jest.fn();
    jest.spyOn(window, 'postMessage').mockImplementation(postMessage);

    ReviewMessageHandler.create({session, targetWindow: window});

    const thread = {id: 1, comments: [{body: 'Hello'}]};
    session.trigger('change:thread', thread);

    expect(postMessage).toHaveBeenCalledWith(
      {type: 'REVIEW_STATE_THREAD_CHANGE', payload: thread},
      window.location.origin
    );

    window.postMessage.mockRestore();
  });

  it('ignores messages not from targetWindow', async () => {
    const session = fakeReviewSession();
    const iframeWindow = {};

    ReviewMessageHandler.create({session, targetWindow: iframeWindow});

    window.dispatchEvent(new MessageEvent('message', {
      data: {
        type: 'CREATE_COMMENT_THREAD',
        payload: {subjectType: 'CE', subjectId: 10, body: 'Test'}
      },
      origin: window.location.origin,
      source: window
    }));

    await new Promise(resolve => setTimeout(resolve, 0));

    expect(session.createThread).not.toHaveBeenCalled();
  });

  it('can be disposed', () => {
    const session = fakeReviewSession();
    const postMessage = jest.fn();
    jest.spyOn(window, 'postMessage').mockImplementation(postMessage);

    const handler = ReviewMessageHandler.create({session, targetWindow: window});
    handler.dispose();

    session.trigger('reset', {});

    expect(postMessage).not.toHaveBeenCalled();

    window.postMessage.mockRestore();
  });
});
