import {createReviewSession} from 'review';

describe('createReviewSession', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('sends pending read marks when page is hidden', async () => {
    window.fetch = jest.fn().mockResolvedValue({ok: true, status: 204});

    const session = createReviewSession({
      entryId: 5,
      initialState: {
        currentUser: {id: 42, name: 'Alice'},
        commentThreads: [{id: 1, permaId: 7, comments: []}],
        commentThreadReads: {}
      }
    });

    session.markThreadsRead([7]);
    window.dispatchEvent(new window.Event('pagehide'));
    await Promise.resolve();

    expect(window.fetch).toHaveBeenCalledWith(
      '/review/entries/5/comment_thread_reads',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({comment_thread_perma_ids: [7]})
      })
    );
  });
});
