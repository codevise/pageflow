import {ReviewSession} from 'review/ReviewSession';

describe('ReviewSession', () => {
  it('emits reset event with threads after fetch', async () => {
    const request = jest.fn().mockResolvedValue({
      currentUser: {id: 42, name: 'Alice'},
      commentThreads: [
        {id: 1, subjectType: 'ContentElement', subjectId: 10, comments: [
          {id: 100, body: 'Hello', creatorId: 42, creatorName: 'Alice'}
        ]}
      ]
    });

    const session = new ReviewSession({entryId: 5, request});
    const listener = jest.fn();
    session.on('reset', listener);

    await session.fetch();

    expect(request).toHaveBeenCalledWith({
      url: '/review/entries/5/comment_threads',
      method: 'GET'
    });

    expect(listener).toHaveBeenCalledWith({
      currentUser: {id: 42, name: 'Alice'},
      commentThreads: [
        expect.objectContaining({
          id: 1,
          comments: [expect.objectContaining({body: 'Hello'})]
        })
      ]
    });
  });

  it('exposes state after fetch', async () => {
    const request = jest.fn().mockResolvedValue({
      currentUser: {id: 42, name: 'Alice'},
      commentThreads: [
        {id: 1, subjectType: 'CE', subjectId: 10, comments: [{id: 100, body: 'Hello'}]}
      ]
    });

    const session = new ReviewSession({entryId: 5, request});

    expect(session.state).toBeNull();

    await session.fetch();

    expect(session.state).toEqual({
      currentUser: {id: 42, name: 'Alice'},
      commentThreads: [
        expect.objectContaining({id: 1})
      ]
    });
  });

  it('emits change:thread after createThread', async () => {
    const request = jest.fn()
      .mockResolvedValueOnce({
        currentUser: {id: 42, name: 'Alice'},
        commentThreads: []
      })
      .mockResolvedValueOnce({
        id: 1,
        subjectType: 'ContentElement',
        subjectId: 10,
        comments: [{id: 100, body: 'Looks good!', creatorId: 42}]
      });

    const session = new ReviewSession({entryId: 5, request});
    await session.fetch();

    const listener = jest.fn();
    session.on('change:thread', listener);

    await session.createThread({
      subjectType: 'ContentElement',
      subjectId: 10,
      body: 'Looks good!'
    });

    expect(request).toHaveBeenLastCalledWith({
      url: '/review/entries/5/comment_threads',
      method: 'POST',
      payload: {
        comment_thread: {
          subject_type: 'ContentElement',
          subject_id: 10,
          comment: {body: 'Looks good!'}
        }
      }
    });

    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({id: 1, subjectType: 'ContentElement'})
    );
  });

  it('includes subject_range in createThread request', async () => {
    const subjectRange = {
      anchor: {path: [0, 0], offset: 5},
      focus: {path: [0, 0], offset: 12}
    };

    const request = jest.fn()
      .mockResolvedValueOnce({
        currentUser: {id: 42, name: 'Alice'},
        commentThreads: []
      })
      .mockResolvedValueOnce({
        id: 1,
        subjectType: 'ContentElement',
        subjectId: 10,
        subjectRange,
        comments: [{id: 100, body: 'About this text', creatorId: 42}]
      });

    const session = new ReviewSession({entryId: 5, request});
    await session.fetch();

    await session.createThread({
      subjectType: 'ContentElement',
      subjectId: 10,
      subjectRange,
      body: 'About this text'
    });

    expect(request).toHaveBeenLastCalledWith({
      url: '/review/entries/5/comment_threads',
      method: 'POST',
      payload: {
        comment_thread: {
          subject_type: 'ContentElement',
          subject_id: 10,
          subject_range: subjectRange,
          comment: {body: 'About this text'}
        }
      }
    });
  });

  it('updates state after createThread', async () => {
    const request = jest.fn()
      .mockResolvedValueOnce({
        currentUser: {id: 42, name: 'Alice'},
        commentThreads: []
      })
      .mockResolvedValueOnce({
        id: 1,
        subjectType: 'ContentElement',
        subjectId: 10,
        comments: [{id: 100, body: 'New thread'}]
      });

    const session = new ReviewSession({entryId: 5, request});
    await session.fetch();
    await session.createThread({subjectType: 'ContentElement', subjectId: 10, body: 'New thread'});

    expect(session.state.commentThreads).toEqual([
      expect.objectContaining({id: 1, comments: [expect.objectContaining({body: 'New thread'})]})
    ]);
  });

  it('emits change:thread with resolvedAt after updateThread', async () => {
    const request = jest.fn()
      .mockResolvedValueOnce({
        currentUser: {id: 42, name: 'Alice'},
        commentThreads: [
          {id: 1, subjectType: 'CE', subjectId: 10, resolvedAt: null, comments: []}
        ]
      })
      .mockResolvedValueOnce({
        id: 1,
        subjectType: 'CE',
        subjectId: 10,
        resolvedAt: '2026-04-09T10:00:00Z',
        comments: []
      });

    const session = new ReviewSession({entryId: 5, request});
    await session.fetch();

    const listener = jest.fn();
    session.on('change:thread', listener);

    await session.updateThread({threadId: 1, resolved: true});

    expect(request).toHaveBeenLastCalledWith({
      url: '/review/entries/5/comment_threads/1',
      method: 'PATCH',
      payload: {comment_thread: {resolved: true}}
    });

    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({id: 1, resolvedAt: '2026-04-09T10:00:00Z'})
    );
  });

  it('updates state after updateThread', async () => {
    const request = jest.fn()
      .mockResolvedValueOnce({
        currentUser: {id: 42, name: 'Alice'},
        commentThreads: [
          {id: 1, subjectType: 'CE', subjectId: 10, resolvedAt: null, comments: []}
        ]
      })
      .mockResolvedValueOnce({
        id: 1, subjectType: 'CE', subjectId: 10,
        resolvedAt: '2026-04-09T10:00:00Z', comments: []
      });

    const session = new ReviewSession({entryId: 5, request});
    await session.fetch();
    await session.updateThread({threadId: 1, resolved: true});

    expect(session.state.commentThreads).toEqual([
      expect.objectContaining({id: 1, resolvedAt: '2026-04-09T10:00:00Z'})
    ]);
  });

  it('emits change:thread with null resolvedAt after unresolving', async () => {
    const request = jest.fn()
      .mockResolvedValueOnce({
        currentUser: {id: 42, name: 'Alice'},
        commentThreads: [
          {id: 1, subjectType: 'CE', subjectId: 10, resolvedAt: '2026-04-09T10:00:00Z', comments: []}
        ]
      })
      .mockResolvedValueOnce({
        id: 1,
        subjectType: 'CE',
        subjectId: 10,
        resolvedAt: null,
        comments: []
      });

    const session = new ReviewSession({entryId: 5, request});
    await session.fetch();

    const listener = jest.fn();
    session.on('change:thread', listener);

    await session.updateThread({threadId: 1, resolved: false});

    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({id: 1, resolvedAt: null})
    );
  });

  it('updates state after createComment', async () => {
    const request = jest.fn()
      .mockResolvedValueOnce({
        currentUser: {id: 42, name: 'Alice'},
        commentThreads: [
          {id: 1, subjectType: 'CE', subjectId: 10, comments: [
            {id: 100, body: 'First', creatorId: 42}
          ]}
        ]
      })
      .mockResolvedValueOnce({id: 101, body: 'Reply', creatorId: 42});

    const session = new ReviewSession({entryId: 5, request});
    await session.fetch();
    await session.createComment({threadId: 1, body: 'Reply'});

    expect(session.state.commentThreads[0].comments).toEqual([
      expect.objectContaining({body: 'First'}),
      expect.objectContaining({body: 'Reply'})
    ]);
  });

  it('emits change:thread with appended comment after createComment', async () => {
    const request = jest.fn()
      .mockResolvedValueOnce({
        currentUser: {id: 42, name: 'Alice'},
        commentThreads: [
          {id: 1, subjectType: 'CE', subjectId: 10, comments: [
            {id: 100, body: 'First', creatorId: 42}
          ]}
        ]
      })
      .mockResolvedValueOnce({
        id: 101, body: 'Reply', creatorId: 42
      });

    const session = new ReviewSession({entryId: 5, request});
    await session.fetch();

    const listener = jest.fn();
    session.on('change:thread', listener);

    await session.createComment({threadId: 1, body: 'Reply'});

    expect(request).toHaveBeenLastCalledWith({
      url: '/review/entries/5/comment_threads/1/comments',
      method: 'POST',
      payload: {comment: {body: 'Reply'}}
    });

    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 1,
        comments: [
          expect.objectContaining({body: 'First'}),
          expect.objectContaining({body: 'Reply'})
        ]
      })
    );
  });
});
