import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {act} from '@testing-library/react';

import {
  CommentThreadReadsSnapshot, useDisplayedCommentThreadReads
} from 'review/commentThreadReadsSnapshot';
import {
  postReviewStateResetMessage, postReviewStateReadsChangeMessage
} from 'review/postMessage';
import {renderWithReviewState} from 'support/renderWithReviewState';

describe('CommentThreadReadsSnapshot', () => {
  const currentUser = {id: 42, name: 'Alice'};
  const commentThreads = [{id: 1, permaId: 5, subjectType: 'CE', subjectId: 10, comments: []}];

  function DisplayedReads() {
    return <span data-testid="reads">{JSON.stringify(useDisplayedCommentThreadReads())}</span>;
  }

  // Messages are delivered in a later task, so posting has to be
  // flushed before the rendered output reflects them.
  async function post(postMessage) {
    await act(async () => {
      postMessage();
      await new Promise(resolve => setTimeout(resolve, 0));
    });
  }

  function postReadsChange(reads) {
    return post(() => postReviewStateReadsChangeMessage(window, reads));
  }

  function reads(getByTestId) {
    return JSON.parse(getByTestId('reads').textContent);
  }

  it('follows live read state without a snapshot', async () => {
    const {getByTestId} = renderWithReviewState(
      <DisplayedReads />,
      {currentUser, commentThreads, commentThreadReads: {}}
    );

    await postReadsChange({5: '2026-08-17T12:00:00.000Z'});

    expect(reads(getByTestId)).toEqual({5: '2026-08-17T12:00:00.000Z'});
  });

  it('keeps the read state it was mounted with', async () => {
    const {getByTestId} = renderWithReviewState(
      <CommentThreadReadsSnapshot>
        <DisplayedReads />
      </CommentThreadReadsSnapshot>,
      {currentUser, commentThreads, commentThreadReads: {5: '2026-08-17T10:00:00.000Z'}}
    );

    await postReadsChange({5: '2026-08-17T12:00:00.000Z'});

    expect(reads(getByTestId)).toEqual({5: '2026-08-17T10:00:00.000Z'});
  });

  it('follows live read state while disabled', async () => {
    const {getByTestId} = renderWithReviewState(
      <CommentThreadReadsSnapshot enabled={false}>
        <DisplayedReads />
      </CommentThreadReadsSnapshot>,
      {currentUser, commentThreads, commentThreadReads: {}}
    );

    await postReadsChange({5: '2026-08-17T12:00:00.000Z'});

    expect(reads(getByTestId)).toEqual({5: '2026-08-17T12:00:00.000Z'});
  });

  it('waits for the current user before freezing', async () => {
    const {getByTestId} = renderWithReviewState(
      <CommentThreadReadsSnapshot>
        <DisplayedReads />
      </CommentThreadReadsSnapshot>,
      {commentThreads, commentThreadReads: {}}
    );

    await post(() => postReviewStateResetMessage(window, {
      currentUser,
      commentThreads,
      commentThreadReads: {5: '2026-08-17T10:00:00.000Z'}
    }));
    await postReadsChange({5: '2026-08-17T12:00:00.000Z'});

    expect(reads(getByTestId)).toEqual({5: '2026-08-17T10:00:00.000Z'});
  });

  it('freezes anew when resetOn changes', async () => {
    const {getByTestId, rerender} = renderWithReviewState(
      <CommentThreadReadsSnapshot resetOn={1}>
        <DisplayedReads />
      </CommentThreadReadsSnapshot>,
      {currentUser, commentThreads, commentThreadReads: {5: '2026-08-17T10:00:00.000Z'}}
    );

    await postReadsChange({5: '2026-08-17T12:00:00.000Z'});
    expect(reads(getByTestId)).toEqual({5: '2026-08-17T10:00:00.000Z'});

    rerender(
      <CommentThreadReadsSnapshot resetOn={2}>
        <DisplayedReads />
      </CommentThreadReadsSnapshot>
    );

    expect(reads(getByTestId)).toEqual({5: '2026-08-17T12:00:00.000Z'});
  });

  it('holds still while resetOn stays the same', async () => {
    const {getByTestId, rerender} = renderWithReviewState(
      <CommentThreadReadsSnapshot resetOn={1}>
        <DisplayedReads />
      </CommentThreadReadsSnapshot>,
      {currentUser, commentThreads, commentThreadReads: {5: '2026-08-17T10:00:00.000Z'}}
    );

    await postReadsChange({5: '2026-08-17T12:00:00.000Z'});

    rerender(
      <CommentThreadReadsSnapshot resetOn={1}>
        <DisplayedReads />
      </CommentThreadReadsSnapshot>
    );

    expect(reads(getByTestId)).toEqual({5: '2026-08-17T10:00:00.000Z'});
  });

  it('reuses the outer snapshot when nested', async () => {
    const {getByTestId} = renderWithReviewState(
      <CommentThreadReadsSnapshot>
        <NestedSnapshot />
      </CommentThreadReadsSnapshot>,
      {currentUser, commentThreads, commentThreadReads: {5: '2026-08-17T10:00:00.000Z'}}
    );

    await postReadsChange({5: '2026-08-17T12:00:00.000Z'});

    expect(reads(getByTestId)).toEqual({5: '2026-08-17T10:00:00.000Z'});
  });

  // Mounted after the outer snapshot froze, as a thread list opening
  // inside an already frozen scope does.
  function NestedSnapshot() {
    return (
      <CommentThreadReadsSnapshot>
        <DisplayedReads />
      </CommentThreadReadsSnapshot>
    );
  }
});
