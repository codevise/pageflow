import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import {useFakeTranslations} from 'pageflow/testHelpers';

import {Thread} from 'review/Thread';
import {renderWithReviewState} from 'support/renderWithReviewState';

describe('Thread reply form', () => {
  useFakeTranslations({
    'pageflow_scrolled.review.reply_placeholder': 'Reply...',
    'pageflow_scrolled.review.reply_count.one': '1 reply',
    'pageflow_scrolled.review.reply_count.other': '%{count} replies',
  });

  const thread = {
    id: 1,
    comments: [{id: 10, body: 'On the pull quote', creatorName: 'Bob', creatorId: 2}]
  };

  // The reply form is hidden while a thread with replies is collapsed,
  // which would leave a drafted reply out of reach.
  it('expands a collapsed thread that has a drafted reply', () => {
    const threadWithReply = {
      ...thread,
      comments: [
        ...thread.comments,
        {id: 11, body: 'A first reply', creatorName: 'Alice', creatorId: 1}
      ]
    };

    const {getByPlaceholderText} = renderWithReviewState(
      <Thread thread={threadWithReply} collapsed />,
      {
        drafts: {
          'Thread:1': {threadId: 1, body: 'Half a reply', pending: false}
        }
      }
    );

    expect(getByPlaceholderText('Reply...')).toHaveValue('Half a reply');
  });

  // Two textareas in one card leave it ambiguous which one typing lands in.
  describe('while editing a comment', () => {
    useFakeTranslations({
      'pageflow_scrolled.review.comment_actions': 'Comment actions',
      'pageflow_scrolled.review.edit_comment': 'Edit',
      'pageflow_scrolled.review.cancel': 'Cancel'
    });

    const ownThread = {
      id: 1,
      comments: [
        {id: 10, body: 'On the pull quote', creatorName: 'Bob', creatorId: 2},
        {id: 11, body: 'A first reply', creatorName: 'Bob', creatorId: 2}
      ]
    };

    async function startEditing(user, getAllByRole, index) {
      await user.click(getAllByRole('button', {name: 'Comment actions'})[index]);
      await user.click(getAllByRole('menuitem', {name: 'Edit'})[0]);
    }

    it('hides the reply form', async () => {
      const user = userEvent.setup();

      const {getAllByRole, queryByPlaceholderText} = renderWithReviewState(
        <Thread thread={ownThread} />,
        {currentUser: {id: 2, name: 'Bob'}}
      );

      expect(queryByPlaceholderText('Reply...')).toBeInTheDocument();

      await startEditing(user, getAllByRole, 0);

      expect(queryByPlaceholderText('Reply...')).toBeNull();
    });

    it('restores the reply form when editing ends', async () => {
      const user = userEvent.setup();

      const {getAllByRole, getByRole, queryByPlaceholderText} = renderWithReviewState(
        <Thread thread={ownThread} />,
        {currentUser: {id: 2, name: 'Bob'}}
      );

      await startEditing(user, getAllByRole, 0);
      await user.click(getByRole('button', {name: 'Cancel'}));

      expect(queryByPlaceholderText('Reply...')).toBeInTheDocument();
    });

    it('keeps only one comment in edit mode', async () => {
      const user = userEvent.setup();

      const {getAllByRole} = renderWithReviewState(
        <Thread thread={ownThread} />,
        {currentUser: {id: 2, name: 'Bob'}}
      );

      await startEditing(user, getAllByRole, 0);
      await startEditing(user, getAllByRole, 1);

      expect(getAllByRole('textbox')).toHaveLength(1);
      expect(getAllByRole('textbox')[0]).toHaveValue('A first reply');
    });
  });
});
