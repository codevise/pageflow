import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import {act, waitFor} from '@testing-library/react';
import {useFakeTranslations} from 'pageflow/testHelpers';

import {ReplyForm} from 'review/ReplyForm';
import {postReviewStateDraftsChangeMessage} from 'review/postMessage';
import {renderWithReviewState} from 'support/renderWithReviewState';

const seed = {
  sections: [{id: 1, permaId: 1}],
  contentElements: [{id: 1, permaId: 10, sectionId: 1, typeName: 'textBlock'}]
};

function draft({body, pending = false}) {
  return {'Thread:7': {threadId: 7, body, pending}};
}

function renderForm(options = {}) {
  return renderWithReviewState(
    <ReplyForm threadId={7} subjectType="ContentElement" subjectId={10} />,
    {seed, ...options}
  );
}

function postDraftsChange(drafts) {
  act(() => postReviewStateDraftsChangeMessage(window, drafts));
}

describe('ReplyForm', () => {
  afterEach(() => jest.restoreAllMocks());

  useFakeTranslations({
    'pageflow_scrolled.review.reply_placeholder': 'Reply...',
    'pageflow_scrolled.review.send': 'Send',
    'pageflow_scrolled.review.enter_for_new_line': 'Enter for new line'
  });

  it('starts out with the stored draft of the thread', () => {
    const {getByPlaceholderText, getByRole} = renderForm({
      drafts: draft({body: 'Half a reply'})
    });

    expect(getByPlaceholderText('Reply...')).toHaveValue('Half a reply');
    expect(getByRole('button', {name: 'Send'})).toBeInTheDocument();
  });

  it('starts out empty without a draft', () => {
    const {getByPlaceholderText, queryByRole} = renderForm();

    expect(getByPlaceholderText('Reply...')).toHaveValue('');
    expect(queryByRole('button', {name: 'Send'})).toBeNull();
  });

  it('stores the text as a draft when the form goes away', async () => {
    const user = userEvent.setup();
    const setDraft = jest.fn();

    const {getByPlaceholderText, unmount} = renderForm({setDraft});

    await user.type(getByPlaceholderText('Reply...'), 'Half a reply');
    unmount();

    expect(setDraft).toHaveBeenCalledWith({threadId: 7, body: 'Half a reply'});
  });

  it('disables the input and shows a spinner while the reply is created', async () => {
    const user = userEvent.setup();

    const {getByPlaceholderText, getByRole, container} = renderForm();

    await user.type(getByPlaceholderText('Reply...'), 'A reply');
    await user.click(getByRole('button', {name: 'Send'}));

    expect(getByPlaceholderText('Reply...')).toBeDisabled();
    expect(getByPlaceholderText('Reply...')).toHaveValue('A reply');
    expect(container.querySelector('[data-file-name="SvgSpinner"]')).not.toBeNull();
  });

  it('clears the input once the reply has been created', async () => {
    const user = userEvent.setup();

    const {getByPlaceholderText, getByRole} = renderForm();

    await user.type(getByPlaceholderText('Reply...'), 'A reply');
    await user.click(getByRole('button', {name: 'Send'}));

    postDraftsChange({});

    await waitFor(() =>
      expect(getByPlaceholderText('Reply...')).toHaveValue('')
    );
    expect(getByPlaceholderText('Reply...')).not.toBeDisabled();
  });

  it('keeps the text when creating the reply failed', async () => {
    const user = userEvent.setup();

    const {getByPlaceholderText, getByRole} = renderForm();

    await user.type(getByPlaceholderText('Reply...'), 'A reply');
    await user.click(getByRole('button', {name: 'Send'}));

    postDraftsChange(draft({body: 'A reply', pending: false}));

    await waitFor(() =>
      expect(getByPlaceholderText('Reply...')).not.toBeDisabled()
    );
    expect(getByPlaceholderText('Reply...')).toHaveValue('A reply');
  });
});
