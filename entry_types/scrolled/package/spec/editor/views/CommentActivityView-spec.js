import '@testing-library/jest-dom/extend-expect';
import {act} from '@testing-library/react';
import {fireEvent} from '@testing-library/dom';

import {editor} from 'pageflow-scrolled/editor';

import {CommentActivityView} from 'editor/views/CommentActivityView';

import {factories, useFakeTranslations, renderBackboneView} from 'pageflow/testHelpers';
import {useEditorGlobals} from 'support';

describe('CommentActivityView', () => {
  const {createEntry} = useEditorGlobals();

  useFakeTranslations({
    'pageflow_scrolled.editor.comment_activity_view.back': 'Comments',
    'pageflow_scrolled.editor.comment_activity_view.tabs.activity': 'Latest activity',
    'pageflow_scrolled.review.activity.no_activity_yet': 'No activity yet',
    'pageflow_scrolled.review.activity.today': 'Today',
    'pageflow_scrolled.review.activity.yesterday': 'Yesterday',
    'pageflow_scrolled.review.earlier_reply_count.one': '1 more',
    'pageflow_scrolled.review.earlier_reply_count.other': '%{count} more',
    'pageflow_scrolled.review.reply_count.one': '1 reply',
    'pageflow_scrolled.review.reply_count.other': '%{count} replies',
    'pageflow_scrolled.review.reply_placeholder': 'Reply...',
    'pageflow_scrolled.review.send': 'Send',
    'pageflow_scrolled.review.toggle_replies': 'Toggle replies',
    'pageflow_scrolled.review.resolve': 'Mark as resolved',
    'pageflow_scrolled.review.unresolve': 'Mark as unresolved'
  });

  function comment({id, body, createdAt, creatorName = 'Bob'}) {
    return {id, creatorId: 43, creatorName, body, createdAt};
  }

  function rowOf(getByText, body) {
    return getByText(body).closest('[aria-current]');
  }

  function isFollowedBy(node, other) {
    return !!(node.compareDocumentPosition(other) & Node.DOCUMENT_POSITION_FOLLOWING);
  }

  function entryWithThreads(commentThreads) {
    const entry = createEntry({
      chapters: [
        {id: 1, permaId: 10, storylineId: 1000, position: 0, configuration: {title: 'Intro'}},
        {id: 2, permaId: 20, storylineId: 1000, position: 1, configuration: {title: 'Middle'}}
      ],
      sections: [
        {id: 1, permaId: 100, chapterId: 1, position: 0},
        {id: 2, permaId: 200, chapterId: 2, position: 0}
      ],
      contentElements: [
        {id: 1, permaId: 1000, sectionId: 1, typeName: 'textBlock'},
        {id: 2, permaId: 2000, sectionId: 2, typeName: 'textBlock'}
      ]
    });

    entry.reviewSession = factories.reviewSession({commentThreads});
    return entry;
  }

  it('lists activity of all chapters newest first', () => {
    const entry = entryWithThreads([
      {
        id: 1, permaId: 5, subjectType: 'ContentElement', subjectId: 1000,
        comments: [comment({
          id: 100, body: 'Older topic', createdAt: '2026-08-17T09:00:00.000Z'
        })]
      },
      {
        id: 2, permaId: 6, subjectType: 'ContentElement', subjectId: 2000,
        comments: [comment({
          id: 200, body: 'Newer topic', createdAt: '2026-08-17T11:00:00.000Z'
        })]
      }
    ]);

    const view = new CommentActivityView({entry, editor});
    const {getByText} = renderBackboneView(view);

    expect(isFollowedBy(getByText('Newer topic'), getByText('Older topic'))).toBe(true);
  });

  it('renders a tab label above the list', () => {
    const entry = entryWithThreads([]);

    const view = new CommentActivityView({entry, editor});
    const {getByRole} = renderBackboneView(view);

    expect(getByRole('tab', {name: 'Latest activity'})).toBeInTheDocument();
  });

  it('triggers selectCommentThread on entry when an entry is clicked', () => {
    const entry = entryWithThreads([{
      id: 7, permaId: 5, subjectType: 'ContentElement', subjectId: 1000,
      comments: [comment({id: 100, body: 'A topic', createdAt: '2026-08-17T09:00:00.000Z'})]
    }]);

    const view = new CommentActivityView({entry, editor});
    const {getByText} = renderBackboneView(view);

    const listener = jest.fn();
    entry.on('selectCommentThread', listener);

    fireEvent.click(getByText('A topic'));

    expect(listener).toHaveBeenCalledWith(7);
  });

  it('marks the entry of the highlighted thread as current', () => {
    const entry = entryWithThreads([{
      id: 7, permaId: 5, subjectType: 'ContentElement', subjectId: 1000,
      comments: [comment({id: 100, body: 'A topic', createdAt: '2026-08-17T09:00:00.000Z'})]
    }]);

    const view = new CommentActivityView({entry, editor});
    const {getByText} = renderBackboneView(view);

    act(() => { entry.set('highlightedThreadId', 7); });

    expect(rowOf(getByText, 'A topic')).not.toBeNull();
  });

  it('marks the entry of a thread already highlighted when it opens', () => {
    const entry = entryWithThreads([{
      id: 7, permaId: 5, subjectType: 'ContentElement', subjectId: 1000,
      comments: [comment({id: 100, body: 'A topic', createdAt: '2026-08-17T09:00:00.000Z'})]
    }]);

    entry.set('highlightedThreadId', 7);

    const view = new CommentActivityView({entry, editor});
    const {getByText} = renderBackboneView(view);

    expect(rowOf(getByText, 'A topic')).not.toBeNull();
  });

  it('keeps the clicked entry marked when the preview reports no highlight', () => {
    const entry = entryWithThreads([
      {
        id: 6, permaId: 5, subjectType: 'ContentElement', subjectId: 1000,
        comments: [comment({
          id: 100, body: 'An element topic', creatorName: 'Bob',
          createdAt: '2026-08-17T09:00:00.000Z'
        })]
      },
      {
        id: 7, permaId: 6, subjectType: 'Section', subjectId: 200,
        comments: [comment({
          id: 200, body: 'A section topic', creatorName: 'Carol',
          createdAt: '2026-08-17T11:00:00.000Z'
        })]
      }
    ]);

    const view = new CommentActivityView({entry, editor});
    const {getByText} = renderBackboneView(view);

    act(() => { entry.set('highlightedThreadId', 6); });

    fireEvent.click(getByText('A section topic'));

    act(() => {
      entry.set({
        highlightedThreadId: undefined,
        selectedCommentsSubject: {subjectType: 'Section', id: 2}
      });
    });

    expect(rowOf(getByText, 'A section topic')).not.toBeNull();
    expect(rowOf(getByText, 'An element topic')).toBeNull();
  });

  it('renders a back link', () => {
    const entry = entryWithThreads([]);

    const view = new CommentActivityView({entry, editor});
    const {getByText} = renderBackboneView(view);

    expect(getByText('Comments')).toBeInTheDocument();
  });

  it('navigates to the comments view when the back link is clicked', () => {
    const entry = entryWithThreads([]);

    const view = new CommentActivityView({entry, editor});
    const {getByText} = renderBackboneView(view);

    const navigate = jest.spyOn(editor, 'navigate').mockImplementation(() => {});

    fireEvent.click(getByText('Comments'));

    expect(navigate).toHaveBeenCalledWith('/scrolled/comments', {trigger: true});

    navigate.mockRestore();
  });
});
