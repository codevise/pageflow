import '@testing-library/jest-dom/extend-expect';

import {CommentThreadView} from 'editor/views/CommentThreadView';

import {factories, useFakeTranslations, renderBackboneView} from 'pageflow/testHelpers';
import {useEditorGlobals} from 'support';

describe('CommentThreadView', () => {
  const {createEntry} = useEditorGlobals();

  useFakeTranslations({
    'pageflow_scrolled.review.reply_placeholder': 'Reply...',
    'pageflow_scrolled.review.reply': 'Reply',
    'pageflow_scrolled.review.resolve': 'Resolve',
    'pageflow_scrolled.review.unresolve': 'Unresolve',
    'pageflow_scrolled.review.toggle_replies': 'Toggle replies'
  });

  it('displays the selected thread from session state', () => {
    const entry = createEntry({});
    entry.reviewSession = factories.reviewSession({
      commentThreads: [
        {id: 1, subjectType: 'ContentElement', subjectId: 10,
         comments: [{id: 100, body: 'First thread', creatorName: 'Alice'}]},
        {id: 2, subjectType: 'ContentElement', subjectId: 10,
         comments: [{id: 200, body: 'Second thread', creatorName: 'Bob'}]}
      ]
    });

    const view = new CommentThreadView({
      entry,
      threadId: 2,
      editor: {}
    });

    const {getByText, queryByText} = renderBackboneView(view);

    expect(getByText('Second thread')).toBeInTheDocument();
    expect(queryByText('First thread')).not.toBeInTheDocument();
  });
});
