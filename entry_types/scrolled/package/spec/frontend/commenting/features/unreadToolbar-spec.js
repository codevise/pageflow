import '@testing-library/jest-dom/extend-expect';
import {fireEvent} from '@testing-library/react';
import {useFakeTranslations} from 'pageflow/testHelpers';

import toolbarStyles from 'frontend/commenting/FloatingToolbar.module.css';

import {renderEntry, useCommentingPageObjects} from 'support/pageObjects/commenting';

describe('unread comments on the collapsed toolbar', () => {
  useCommentingPageObjects();

  useFakeTranslations({
    'pageflow_scrolled.review.show_comments': 'Show comments',
    'pageflow_scrolled.review.show_comments_with_unread.one':
      'Show comments (1 unread comment)',
    'pageflow_scrolled.review.show_comments_with_unread.other':
      'Show comments (%{count} unread comments)'
  });

  const currentUser = {id: 42, name: 'Alice'};

  function renderCollapsedEntry({comments}) {
    const entry = renderEntry({
      seed: {contentElements: [{typeName: 'withTestId', configuration: {testId: 5}}]},
      commenting: {
        currentUser,
        commentThreads: [
          {id: 1, permaId: 7, subjectType: 'ContentElement', subjectId: 1, comments}
        ],
        commentThreadReads: {}
      }
    });

    fireEvent.click(entry.getHideCommentsButton());

    return entry;
  }

  function comment(attributes) {
    return {
      id: 10, body: 'Nice work', creatorName: 'Bob', creatorId: 43,
      createdAt: '2026-08-17T11:00:00.000Z',
      ...attributes
    };
  }

  function unreadDot(entry) {
    return entry.getShowCommentsButton().querySelector(`.${toolbarStyles.unreadDot}`);
  }

  it('marks the show button while comments are unseen', () => {
    const entry = renderCollapsedEntry({comments: [comment()]});

    expect(unreadDot(entry)).not.toBeNull();
  });

  it('names the unseen comments on the show button', () => {
    const entry = renderCollapsedEntry({
      comments: [comment(), comment({id: 11, creatorId: 44})]
    });

    expect(entry.getShowCommentsButton())
      .toHaveAttribute('aria-label', 'Show comments (2 unread comments)');
  });

  it('leaves the show button unmarked without unseen comments', () => {
    const entry = renderCollapsedEntry({
      comments: [comment({creatorId: currentUser.id, creatorName: 'Alice'})]
    });

    expect(unreadDot(entry)).toBeNull();
    expect(entry.getShowCommentsButton())
      .toHaveAttribute('aria-label', 'Show comments');
  });
});
