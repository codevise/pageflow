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
});
