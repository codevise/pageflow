import '@testing-library/jest-dom/extend-expect';

import {editor} from 'pageflow-scrolled/editor';


import {NewThreadView} from 'editor/views/NewThreadView';

import {factories, useFakeTranslations, renderBackboneView} from 'pageflow/testHelpers';
import {useEditorGlobals} from 'support';
import {fireEvent} from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

describe('NewThreadView', () => {
  const {createEntry} = useEditorGlobals();

  useFakeTranslations({
    'pageflow_scrolled.review.add_comment_placeholder': 'Add a comment...',
    'pageflow_scrolled.review.send': 'Send',
    'pageflow_scrolled.editor.new_thread_view.tabs.newComment': 'New topic',
    'pageflow_scrolled.editor.new_thread_view.back': 'Comments'
  });

  function buildView(entry) {
    return new NewThreadView({
      entry,
      subjectType: 'ContentElement',
      subjectId: 10,
      subjectRange: {
        anchor: {path: [0, 0], offset: 0},
        focus: {path: [0, 0], offset: 5}
      },
      editor
    });
  }

  it('renders a new thread form for the pending subject', () => {
    const entry = createEntry({});
    entry.reviewSession = factories.reviewSession();

    const {getByPlaceholderText} = renderBackboneView(buildView(entry));

    expect(getByPlaceholderText('Add a comment...')).toBeInTheDocument();
  });

  it('renders a New topic tab label above the form', () => {
    const entry = createEntry({});
    entry.reviewSession = factories.reviewSession();

    const {getByRole} = renderBackboneView(buildView(entry));

    expect(getByRole('tab', {name: 'New topic'})).toBeInTheDocument();
  });

  it('renders a back link', () => {
    const entry = createEntry({});
    entry.reviewSession = factories.reviewSession();

    const {getByText} = renderBackboneView(buildView(entry));

    expect(getByText('Comments')).toBeInTheDocument();
  });

  // Submitting cannot reach the session here: jsdom leaves MessageEvent
  // source unset for same-window posts, so the handler drops the create
  // message. NewThreadForm-spec covers the form disabling itself.
  it('stores the entered text as a draft when the view is closed', async () => {
    const user = userEvent.setup();
    const entry = createEntry({});
    entry.reviewSession = factories.reviewSession();
    const view = buildView(entry);

    const {getByPlaceholderText} = renderBackboneView(view);

    await user.type(getByPlaceholderText('Add a comment...'), 'Half a thought');
    view.close();

    expect(entry.reviewSession.drafts).toEqual({
      'ContentElement:10': {
        subjectType: 'ContentElement',
        subjectId: 10,
        body: 'Half a thought',
        pending: false
      }
    });
  });

  it('restores the draft stored for the subject', () => {
    const entry = createEntry({});
    entry.reviewSession = factories.reviewSession();
    entry.reviewSession.setDraft({
      subjectType: 'ContentElement', subjectId: 10, body: 'Half a thought'
    });

    const {getByPlaceholderText} = renderBackboneView(buildView(entry));

    expect(getByPlaceholderText('Add a comment...')).toHaveValue('Half a thought');
  });

  it('navigates to the comments selection tab when the back link is clicked', () => {
    const entry = createEntry({});
    entry.reviewSession = factories.reviewSession();

    const {getByText} = renderBackboneView(buildView(entry));

    const navigate = jest.spyOn(editor, 'navigate').mockImplementation(() => {});

    fireEvent.click(getByText('Comments'));

    expect(navigate).toHaveBeenCalledWith(
      '/scrolled/comments?tab=selection', {trigger: true}
    );

    navigate.mockRestore();
  });
});
