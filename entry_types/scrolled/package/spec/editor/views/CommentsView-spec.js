import '@testing-library/jest-dom/extend-expect';

import {editor} from 'pageflow-scrolled/editor';

import {CommentsView} from 'editor/views/CommentsView';

import {factories, useFakeTranslations, renderBackboneView} from 'pageflow/testHelpers';
import {useEditorGlobals} from 'support';
import {fireEvent} from '@testing-library/dom';
import {act} from '@testing-library/react';

describe('CommentsView', () => {
  const {createEntry} = useEditorGlobals();

  useFakeTranslations({
    'pageflow_scrolled.review.new_topic': 'New topic',
    'pageflow_scrolled.review.add_comment_placeholder': 'Add a comment...',
    'pageflow_scrolled.review.send': 'Send',
    'pageflow_scrolled.editor.content_elements.textBlock.name': 'Text',
    'pageflow_scrolled.editor.comments_view.tabs.comments': 'All comments',
    'pageflow_scrolled.editor.comments_view.tabs.selection': 'For selection',
    'pageflow.editor.templates.back_button_decorator.outline': 'Outline'
  });

  function setupEntry() {
    const entry = createEntry({
      contentElements: [{id: 1, permaId: 10, typeName: 'textBlock'}]
    });
    entry.set('selectedContentElementCommentsId', 1);
    entry.reviewSession = factories.reviewSession({
      commentThreads: [{
        id: 1,
        subjectType: 'ContentElement',
        subjectId: 10,
        comments: [{id: 100, body: 'A thread', creatorName: 'Alice'}]
      }]
    });
    return entry;
  }

  it('renders both tab labels', () => {
    const entry = setupEntry();

    const view = new CommentsView({entry, editor});
    const {getAllByRole} = renderBackboneView(view);

    const labels = getAllByRole('tab').map(t => t.textContent);
    expect(labels).toEqual(['All comments', 'For selection']);
  });

  it('shows the all-comments tab by default', () => {
    const entry = setupEntry();

    const view = new CommentsView({entry, editor});
    const {getByText} = renderBackboneView(view);

    expect(getByText('Text')).toBeInTheDocument();
    expect(getByText('A thread')).toBeInTheDocument();
  });

  it('uses defaultTab option to pick the initial tab', () => {
    const entry = setupEntry();

    const view = new CommentsView({entry, editor, defaultTab: 'selection'});
    const {queryByText, getByText} = renderBackboneView(view);

    expect(getByText('A thread')).toBeInTheDocument();
    expect(queryByText('Text')).not.toBeInTheDocument();
  });

  it('switches to the selection tab on click', () => {
    const entry = setupEntry();

    const view = new CommentsView({entry, editor});
    const {getByRole, queryByText, getByText} = renderBackboneView(view);

    expect(getByText('Text')).toBeInTheDocument();

    act(() => {
      fireEvent.click(getByRole('tab', {name: 'For selection'}));
    });

    expect(queryByText('Text')).not.toBeInTheDocument();
    expect(getByText('A thread')).toBeInTheDocument();
  });

  it('renders a back link', () => {
    const entry = setupEntry();

    const view = new CommentsView({entry, editor});
    const {getByText} = renderBackboneView(view);

    expect(getByText('Outline')).toBeInTheDocument();
  });

  it('navigates to root when the back link is clicked', () => {
    const entry = setupEntry();

    const view = new CommentsView({entry, editor});
    const {getByText} = renderBackboneView(view);

    const navigate = jest.spyOn(editor, 'navigate').mockImplementation(() => {});

    fireEvent.click(getByText('Outline'));

    expect(navigate).toHaveBeenCalledWith('/', {trigger: true});

    navigate.mockRestore();
  });

});
