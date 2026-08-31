import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import {act, waitFor} from '@testing-library/react';
import {useFakeTranslations} from 'pageflow/testHelpers';

import {NewThreadForm} from 'review/NewThreadForm';
import {postReviewStateDraftsChangeMessage} from 'review/postMessage';
import {renderWithReviewState} from 'support/renderWithReviewState';

const seed = {
  sections: [{id: 1, permaId: 1}],
  contentElements: [{id: 1, permaId: 10, sectionId: 1, typeName: 'textBlock'}]
};

function draft({body, pending = false}) {
  return {
    'ContentElement:10': {
      subjectType: 'ContentElement', subjectId: 10, body, pending
    }
  };
}

function renderForm(options = {}) {
  return renderWithReviewState(
    <NewThreadForm subjectType="ContentElement" subjectId={10} />,
    {seed, ...options}
  );
}

function postDraftsChange(drafts) {
  act(() => postReviewStateDraftsChangeMessage(window, drafts));
}

describe('NewThreadForm', () => {
  afterEach(() => jest.restoreAllMocks());

  useFakeTranslations({
    'pageflow_scrolled.review.add_comment_placeholder': 'Add a comment...',
    'pageflow_scrolled.review.send': 'Send',
    'pageflow_scrolled.review.enter_for_new_line': 'Enter for new line'
  });

  describe('draft restoring', () => {
    it('starts out with the stored draft of the subject', () => {
      const {getByPlaceholderText} = renderForm({
        drafts: draft({body: 'Half a thought'})
      });

      expect(getByPlaceholderText('Add a comment...')).toHaveValue('Half a thought');
    });

    it('starts out empty without a draft', () => {
      const {getByPlaceholderText} = renderForm();

      expect(getByPlaceholderText('Add a comment...')).toHaveValue('');
    });
  });

  describe('draft storing', () => {
    it('stores the text when the form goes away', async () => {
      const user = userEvent.setup();
      const setDraft = jest.fn();

      const {getByPlaceholderText, unmount} = renderForm({setDraft});

      await user.type(getByPlaceholderText('Add a comment...'), 'Half a thought');
      unmount();

      expect(setDraft).toHaveBeenCalledWith({
        subjectType: 'ContentElement',
        subjectId: 10,
        body: 'Half a thought'
      });
    });

    it('stores a blank text once the input has been cleared', async () => {
      const user = userEvent.setup();
      const setDraft = jest.fn();

      const {getByPlaceholderText, unmount} = renderForm({
        drafts: draft({body: 'Never mind'}), setDraft
      });

      await user.clear(getByPlaceholderText('Add a comment...'));
      unmount();

      expect(setDraft).toHaveBeenLastCalledWith(
        expect.objectContaining({body: ''})
      );
    });

    it('does not store the text while the session is creating the thread', () => {
      const setDraft = jest.fn();

      const {unmount} = renderForm({
        drafts: draft({body: 'Looks good', pending: true}),
        setDraft
      });

      unmount();

      expect(setDraft).not.toHaveBeenCalled();
    });

    it('does not store the text after submitting', async () => {
      const user = userEvent.setup();
      const setDraft = jest.fn();

      const {getByPlaceholderText, getByRole, unmount} = renderForm({setDraft});

      await user.type(getByPlaceholderText('Add a comment...'), 'Looks good');
      await user.click(getByRole('button', {name: 'Send'}));

      unmount();

      expect(setDraft).not.toHaveBeenCalled();
    });

    it('stores the text again when creating the thread failed', async () => {
      const user = userEvent.setup();
      const setDraft = jest.fn();

      const {getByPlaceholderText, getByRole, unmount} = renderForm({setDraft});

      await user.type(getByPlaceholderText('Add a comment...'), 'Looks good');
      await user.click(getByRole('button', {name: 'Send'}));

      postDraftsChange(draft({body: 'Looks good', pending: false}));
      await waitFor(() =>
        expect(getByPlaceholderText('Add a comment...')).not.toBeDisabled()
      );

      await user.type(getByPlaceholderText('Add a comment...'), ' after all');
      unmount();

      expect(setDraft).toHaveBeenCalledWith(
        expect.objectContaining({body: 'Looks good after all'})
      );
    });
  });

  describe('while the thread is being created', () => {
    it('disables the input and shows a spinner', () => {
      const {getByPlaceholderText, getByRole, container} = renderForm({
        drafts: draft({body: 'Looks good', pending: true})
      });

      expect(getByPlaceholderText('Add a comment...')).toBeDisabled();
      expect(getByRole('button', {name: 'Send'})).toBeDisabled();
      expect(container.querySelector('[data-file-name="SvgSpinner"]')).not.toBeNull();
    });

    it('ignores further submits', async () => {
      const user = userEvent.setup();
      const postMessage = jest.spyOn(window.top, 'postMessage').mockImplementation(() => {});

      const {getByRole} = renderForm({
        drafts: draft({body: 'Looks good', pending: true})
      });

      await user.click(getByRole('button', {name: 'Send'}));

      expect(postMessage).not.toHaveBeenCalledWith(
        expect.objectContaining({type: 'CREATE_COMMENT_THREAD'}),
        expect.anything()
      );

      postMessage.mockRestore();
    });

    it('is editable again once the draft is no longer pending', () => {
      const {getByPlaceholderText, getByRole} = renderForm({
        drafts: draft({body: 'Looks good', pending: false})
      });

      expect(getByPlaceholderText('Add a comment...')).not.toBeDisabled();
      expect(getByRole('button', {name: 'Send'})).toBeEnabled();
      expect(getByPlaceholderText('Add a comment...')).toHaveValue('Looks good');
    });
  });
});
