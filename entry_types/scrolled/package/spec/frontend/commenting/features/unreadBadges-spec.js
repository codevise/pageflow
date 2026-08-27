import '@testing-library/jest-dom/extend-expect';
import {act, fireEvent} from '@testing-library/react';
import {useFakeTranslations} from 'pageflow/testHelpers';

import {postReviewStateReadsChangeMessage} from 'review/postMessage';

import {renderEntry, useCommentingPageObjects} from 'support/pageObjects/commenting';

describe('unread badges', () => {
  useCommentingPageObjects();

  useFakeTranslations({
    'pageflow_scrolled.review.reply_placeholder': 'Reply...',
    'pageflow_scrolled.review.unread_count.one': '1 unread',
    'pageflow_scrolled.review.unread_count.other': '%{count} unread'
  });

  function renderEntryWithUnreadThread() {
    return renderEntry({
      seed: {
        contentElements: [{typeName: 'withTestId', configuration: {testId: 5}}]
      },
      commenting: {
        currentUser: {id: 42, name: 'Alice'},
        commentThreads: [
          {
            id: 1, permaId: 7, subjectType: 'ContentElement', subjectId: 1,
            comments: [{
              id: 10, body: 'Nice work', creatorName: 'Bob', creatorId: 2,
              createdAt: '2026-08-17T11:00:00.000Z'
            }]
          }
        ],
        commentThreadReads: {}
      }
    });
  }

  // Delivered in a later task, so posting has to be flushed before the
  // rendered output reflects it.
  async function markThreadRead() {
    await act(async () => {
      postReviewStateReadsChangeMessage(window, {7: '2026-08-17T12:00:00.000Z'});
      await new Promise(resolve => setTimeout(resolve, 0));
    });
  }

  it('marks badge of subject with unseen comments', () => {
    const entry = renderEntryWithUnreadThread();

    expect(entry.queryAllUnreadCommentBadges()).toHaveLength(1);
  });

  it('clears badge once its threads have been read', async () => {
    const entry = renderEntryWithUnreadThread();

    fireEvent.click(entry.getAllCommentBadges()[0]);
    await markThreadRead();

    expect(entry.getByText('Nice work')).toBeInTheDocument();
    expect(entry.queryAllUnreadCommentBadges()).toEqual([]);
  });
});
