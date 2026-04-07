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
});
