import '@testing-library/jest-dom/extend-expect';

import {NewThreadView} from 'editor/views/NewThreadView';

import {factories, useFakeTranslations, renderBackboneView} from 'pageflow/testHelpers';
import {useEditorGlobals} from 'support';

describe('NewThreadView', () => {
  const {createEntry} = useEditorGlobals();

  useFakeTranslations({
    'pageflow_scrolled.review.add_comment_placeholder': 'Add a comment...',
    'pageflow_scrolled.review.send': 'Send',
    'pageflow_scrolled.review.cancel': 'Cancel'
  });

  it('renders a new thread form for the pending subject', () => {
    const entry = createEntry({});
    entry.reviewSession = factories.reviewSession();

    const view = new NewThreadView({
      entry,
      subjectType: 'ContentElement',
      subjectId: 10,
      subjectRange: {
        anchor: {path: [0, 0], offset: 0},
        focus: {path: [0, 0], offset: 5}
      },
      editor: {}
    });

    const {getByPlaceholderText} = renderBackboneView(view);
    view.onShow();

    expect(getByPlaceholderText('Add a comment...')).toBeInTheDocument();
  });
});
