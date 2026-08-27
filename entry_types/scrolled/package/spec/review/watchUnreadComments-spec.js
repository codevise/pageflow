import BackboneEvents from 'backbone-events-standalone';
import {Model} from 'backbone';

import {watchUnreadComments} from 'review/watchUnreadComments';

describe('watchUnreadComments', () => {
  const currentUser = {id: 42, name: 'Alice'};

  function fakeSession(state = null) {
    const session = {state};
    Object.assign(session, BackboneEvents);
    return session;
  }

  function thread(attributes = {}) {
    return {
      id: 1,
      permaId: 5,
      comments: [{
        id: 100, creatorId: 43, createdAt: '2026-08-17T11:00:00.000Z'
      }],
      ...attributes
    };
  }

  function watch(state) {
    const entry = new Model();
    const session = fakeSession(state);

    watchUnreadComments({entry, session});

    return {entry, session};
  }

  it('is false before the session has state', () => {
    const {entry} = watch(null);

    expect(entry.get('hasUnreadComments')).toBe(false);
  });

  it('is true while a thread holds unseen comments', () => {
    const {entry} = watch({
      currentUser,
      commentThreads: [thread()],
      commentThreadReads: {}
    });

    expect(entry.get('hasUnreadComments')).toBe(true);
  });

  it('is false once every comment has been read', () => {
    const {entry} = watch({
      currentUser,
      commentThreads: [thread()],
      commentThreadReads: {5: '2026-08-17T12:00:00.000Z'}
    });

    expect(entry.get('hasUnreadComments')).toBe(false);
  });

  it('is true while a resolution by someone else is unseen', () => {
    const {entry} = watch({
      currentUser,
      commentThreads: [thread({
        resolvedAt: '2026-08-17T13:00:00.000Z',
        resolvedById: 44
      })],
      commentThreadReads: {5: '2026-08-17T12:00:00.000Z'}
    });

    expect(entry.get('hasUnreadComments')).toBe(true);
  });

  it('is false for own comments', () => {
    const {entry} = watch({
      currentUser,
      commentThreads: [thread({
        comments: [{id: 100, creatorId: currentUser.id, createdAt: '2026-08-17T11:00:00.000Z'}]
      })],
      commentThreadReads: {}
    });

    expect(entry.get('hasUnreadComments')).toBe(false);
  });

  it('follows threads arriving with a fetch', () => {
    const {entry, session} = watch(null);

    session.state = {
      currentUser,
      commentThreads: [thread()],
      commentThreadReads: {}
    };
    session.trigger('reset', session.state);

    expect(entry.get('hasUnreadComments')).toBe(true);
  });

  it('follows threads being read', () => {
    const {entry, session} = watch({
      currentUser,
      commentThreads: [thread()],
      commentThreadReads: {}
    });

    session.state = {
      ...session.state,
      commentThreadReads: {5: '2026-08-17T12:00:00.000Z'}
    };
    session.trigger('change:reads', session.state.commentThreadReads);

    expect(entry.get('hasUnreadComments')).toBe(false);
  });

  it('follows replies being added', () => {
    const {entry, session} = watch({
      currentUser,
      commentThreads: [thread()],
      commentThreadReads: {5: '2026-08-17T12:00:00.000Z'}
    });

    const updatedThread = thread({
      comments: [
        ...thread().comments,
        {id: 101, creatorId: 44, createdAt: '2026-08-17T13:00:00.000Z'}
      ]
    });
    session.state = {...session.state, commentThreads: [updatedThread]};
    session.trigger('change:thread', updatedThread);

    expect(entry.get('hasUnreadComments')).toBe(true);
  });
});
