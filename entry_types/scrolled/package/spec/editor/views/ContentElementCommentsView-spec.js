import '@testing-library/jest-dom/extend-expect';
import BackboneEvents from 'backbone-events-standalone';

import {ContentElementCommentsView} from 'editor/views/ContentElementCommentsView';

import {useFakeTranslations, renderBackboneView} from 'pageflow/testHelpers';
import {useEditorGlobals} from 'support';
import {act, waitFor} from '@testing-library/react';

describe('ContentElementCommentsView', () => {
  const {createEntry} = useEditorGlobals();

  useFakeTranslations({
    'pageflow_scrolled.review.add_comment_placeholder': 'Add a comment...',
    'pageflow_scrolled.review.new_topic': 'New topic',
    'pageflow_scrolled.review.send': 'Send'
  });

  it('displays threads from session state', () => {
    const entry = createEntry({
      contentElements: [{id: 1, permaId: 10, typeName: 'textBlock'}]
    });
    entry.reviewSession = fakeReviewSession({
      currentUser: {id: 1},
      commentThreads: [{
        id: 1,
        subjectType: 'ContentElement',
        subjectId: 10,
        comments: [{id: 100, body: 'Looks good', creatorName: 'Alice'}]
      }]
    });

    const view = new ContentElementCommentsView({
      entry,
      model: entry.contentElements.get(1),
      editor: {}
    });

    const {getByText} = renderBackboneView(view);

    expect(getByText('Looks good')).toBeInTheDocument();
  });

  it('updates when session emits change:thread', async () => {
    const entry = createEntry({
      contentElements: [{id: 1, permaId: 10, typeName: 'textBlock'}]
    });
    entry.reviewSession = fakeReviewSession({
      currentUser: {id: 1},
      commentThreads: []
    });

    const view = new ContentElementCommentsView({
      entry,
      model: entry.contentElements.get(1),
      editor: {}
    });

    const {getByText} = renderBackboneView(view);

    act(() => {
      entry.reviewSession.trigger('change:thread', {
        id: 1,
        subjectType: 'ContentElement',
        subjectId: 10,
        comments: [{id: 100, body: 'New comment', creatorName: 'Bob'}]
      });
    });

    await waitFor(() => {
      expect(getByText('New comment')).toBeInTheDocument();
    });
  });
});

function fakeReviewSession(state = null) {
  const session = {
    state,
    createThread: jest.fn().mockResolvedValue(),
    createComment: jest.fn().mockResolvedValue()
  };

  Object.assign(session, BackboneEvents);
  return session;
}
