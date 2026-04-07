import BackboneEvents from 'backbone-events-standalone';

import {ReviewMessageHandler} from 'review/ReviewMessageHandler';

function fakeReviewSession() {
  const session = {};
  Object.assign(session, BackboneEvents);
  return session;
}

describe('ReviewMessageHandler', () => {
  it('posts REVIEW_STATE_RESET to target window on session reset', () => {
    const session = fakeReviewSession();
    const targetWindow = {postMessage: jest.fn()};

    ReviewMessageHandler.create({session, targetWindow});

    const state = {currentUser: {id: 42}, commentThreads: [{id: 1}]};
    session.trigger('reset', state);

    expect(targetWindow.postMessage).toHaveBeenCalledWith(
      {type: 'REVIEW_STATE_RESET', payload: state},
      window.location.origin
    );
  });

  it('posts REVIEW_STATE_THREAD_CHANGE to target window on session change:thread', () => {
    const session = fakeReviewSession();
    const targetWindow = {postMessage: jest.fn()};

    ReviewMessageHandler.create({session, targetWindow});

    const thread = {id: 1, comments: [{body: 'Hello'}]};
    session.trigger('change:thread', thread);

    expect(targetWindow.postMessage).toHaveBeenCalledWith(
      {type: 'REVIEW_STATE_THREAD_CHANGE', payload: thread},
      window.location.origin
    );
  });

  it('can be disposed', () => {
    const session = fakeReviewSession();
    const targetWindow = {postMessage: jest.fn()};

    const handler = ReviewMessageHandler.create({session, targetWindow});
    handler.dispose();

    session.trigger('reset', {});

    expect(targetWindow.postMessage).not.toHaveBeenCalled();
  });
});
