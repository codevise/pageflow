import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import I18n from 'i18n-js';
import MockDate from 'mockdate';
import {useFakeTranslations} from 'pageflow/testHelpers';

import {Comment} from 'review/Comment';
import {renderWithReviewState} from 'support/renderWithReviewState';

describe('Comment', () => {
  const comment = {
    id: 10,
    body: 'On the pull quote',
    creatorName: 'Bob',
    creatorId: 2,
    createdAt: '2026-03-15T14:30:00Z'
  };

  const originalLocale = I18n.locale;

  beforeEach(() => {
    MockDate.set('2026-06-01');
  });

  afterEach(() => {
    MockDate.reset();
    I18n.locale = originalLocale;
  });

  it('formats the timestamp in the interface locale', () => {
    I18n.locale = 'de';

    const {getByText} = renderWithReviewState(<Comment comment={comment} />);

    expect(getByText(/^\d+\. März$/)).toBeInTheDocument();
  });

  it('formats the timestamp according to English conventions', () => {
    I18n.locale = 'en';

    const {getByText} = renderWithReviewState(<Comment comment={comment} />);

    expect(getByText(/^Mar \d+$/)).toBeInTheDocument();
  });

  it('includes the year for comments from previous years', () => {
    I18n.locale = 'en';

    const {getByText} = renderWithReviewState(
      <Comment comment={{...comment, createdAt: '2025-03-15T14:30:00Z'}} />
    );

    expect(getByText(/^Mar \d+, 2025$/)).toBeInTheDocument();
  });

  it('renders machine readable timestamp', () => {
    I18n.locale = 'en';

    const {getByText} = renderWithReviewState(<Comment comment={comment} />);

    expect(getByText(/^Mar \d+$/)).toHaveAttribute('datetime', '2026-03-15T14:30:00Z');
  });

  describe('edited hint', () => {
    useFakeTranslations({
      'en.pageflow_scrolled.review.edited': 'Edited %{date}',
      'de.pageflow_scrolled.review.edited': 'Bearbeitet %{date}'
    }, {multiLocale: true});

    const editedComment = {...comment, editedAt: '2026-03-16T09:00:00Z'};

    it('is rendered below the body of edited comments', () => {
      I18n.locale = 'en';

      const {getByText} = renderWithReviewState(<Comment comment={editedComment} />);

      const hint = getByText(/^Edited Mar \d+, \d+:\d\d/);
      const body = getByText('On the pull quote');

      expect(body.compareDocumentPosition(hint) & Node.DOCUMENT_POSITION_FOLLOWING)
        .toBeTruthy();
    });

    it('formats the edit date in the interface locale', () => {
      I18n.locale = 'de';

      const {getByText} = renderWithReviewState(<Comment comment={editedComment} />);

      expect(getByText(/^Bearbeitet \d+\. März, \d+:\d\d/)).toBeInTheDocument();
    });

    it('includes the year for edits from previous years', () => {
      I18n.locale = 'en';

      const {getByText} = renderWithReviewState(
        <Comment comment={{...comment, editedAt: '2025-03-16T09:00:00Z'}} />
      );

      expect(getByText(/^Edited Mar \d+, 2025, \d+:\d\d/)).toBeInTheDocument();
    });

    it('is not rendered for comments that were never edited', () => {
      I18n.locale = 'en';

      const {queryByText} = renderWithReviewState(<Comment comment={comment} />);

      expect(queryByText(/^Edited/)).toBeNull();
    });

    it('is not rendered while the comment is being edited', () => {
      I18n.locale = 'en';

      const {queryByText} = renderWithReviewState(
        <Comment comment={editedComment}
                 threadId={1}
                 editing
                 onEditEnd={() => {}} />,
        {currentUser: {id: 2, name: 'Bob'}}
      );

      expect(queryByText(/^Edited/)).toBeNull();
    });
  });

  describe('editing', () => {
    useFakeTranslations({
      'pageflow_scrolled.review.comment_actions': 'Comment actions',
      'pageflow_scrolled.review.edit_comment': 'Edit',
      'pageflow_scrolled.review.save': 'Save',
      'pageflow_scrolled.review.cancel': 'Cancel'
    });

    it('offers the menu for own comments', () => {
      const {queryByRole} = renderWithReviewState(
        <Comment comment={comment} threadId={1} onEdit={() => {}} />,
        {currentUser: {id: 2, name: 'Bob'}}
      );

      expect(queryByRole('button', {name: 'Comment actions'})).toBeInTheDocument();
    });

    it('does not offer the menu for comments of other users', () => {
      const {queryByRole} = renderWithReviewState(
        <Comment comment={comment} threadId={1} onEdit={() => {}} />,
        {currentUser: {id: 99, name: 'Alice'}}
      );

      expect(queryByRole('button', {name: 'Comment actions'})).toBeNull();
    });

    it('does not offer the menu where editing is not available', () => {
      const {queryByRole} = renderWithReviewState(
        <Comment comment={comment} threadId={1} />,
        {currentUser: {id: 2, name: 'Bob'}}
      );

      expect(queryByRole('button', {name: 'Comment actions'})).toBeNull();
    });

    it('replaces the body with a textarea holding the current text', () => {
      const {getByRole, container} = renderWithReviewState(
        <Comment comment={comment} threadId={1} editing onEditEnd={() => {}} />,
        {currentUser: {id: 2, name: 'Bob'}}
      );

      expect(getByRole('textbox')).toHaveValue('On the pull quote');
      expect(container.querySelector('p')).toBeNull();
    });

    it('posts the new text and leaves edit mode on save', async () => {
      const user = userEvent.setup();
      const postMessage = jest.spyOn(window.top, 'postMessage').mockImplementation(() => {});
      const onEditEnd = jest.fn();

      const {getByRole} = renderWithReviewState(
        <Comment comment={comment} threadId={7} editing onEditEnd={onEditEnd} />,
        {currentUser: {id: 2, name: 'Bob'}}
      );

      await user.clear(getByRole('textbox'));
      await user.type(getByRole('textbox'), 'Fixed');
      await user.click(getByRole('button', {name: 'Save'}));

      expect(postMessage).toHaveBeenCalledWith(
        {
          type: 'UPDATE_COMMENT',
          payload: {threadId: 7, commentId: 10, body: 'Fixed'}
        },
        window.location.origin
      );
      expect(onEditEnd).toHaveBeenCalled();

      postMessage.mockRestore();
    });

    it('leaves edit mode without posting on cancel', async () => {
      const user = userEvent.setup();
      const postMessage = jest.spyOn(window.top, 'postMessage').mockImplementation(() => {});
      const onEditEnd = jest.fn();

      const {getByRole} = renderWithReviewState(
        <Comment comment={comment} threadId={7} editing onEditEnd={onEditEnd} />,
        {currentUser: {id: 2, name: 'Bob'}}
      );

      await user.type(getByRole('textbox'), ' and more');
      await user.click(getByRole('button', {name: 'Cancel'}));

      expect(postMessage).not.toHaveBeenCalled();
      expect(onEditEnd).toHaveBeenCalled();

      postMessage.mockRestore();
    });

    it('does not allow saving an empty body', async () => {
      const user = userEvent.setup();

      const {getByRole} = renderWithReviewState(
        <Comment comment={comment} threadId={7} editing onEditEnd={() => {}} />,
        {currentUser: {id: 2, name: 'Bob'}}
      );

      await user.clear(getByRole('textbox'));

      expect(getByRole('button', {name: 'Save'})).toBeDisabled();
    });
  });
});
