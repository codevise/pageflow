import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';

import {editor} from 'pageflow-scrolled/editor';
import {ContentElementCommentsView} from 'editor/views/ContentElementCommentsView';

import {factories, useFakeTranslations, renderBackboneView} from 'pageflow/testHelpers';
import {useEditorGlobals} from 'support';
import {act, waitFor} from '@testing-library/react';

describe('ContentElementCommentsView', () => {
  const {createEntry} = useEditorGlobals();

  beforeAll(() => {
    editor.contentElementTypes.register('fixture', {
      compareRanges: (a, b) => (a?.start ?? 0) - (b?.start ?? 0)
    });
  });

  useFakeTranslations({
    'pageflow_scrolled.review.add_comment_placeholder': 'Add a comment...',
    'pageflow_scrolled.review.new_topic': 'New topic',
    'pageflow_scrolled.review.send': 'Send',
    'pageflow_scrolled.review.no_threads_yet': 'No comments yet'
  });

  it('displays threads of selected content element from session state', () => {
    const entry = createEntry({
      contentElements: [{id: 1, permaId: 10, typeName: 'fixture'}]
    });
    entry.set('selectedContentElementCommentsId', 1);
    entry.reviewSession = factories.reviewSession({
      commentThreads: [{
        id: 1,
        subjectType: 'ContentElement',
        subjectId: 10,
        comments: [{id: 100, body: 'Looks good', creatorName: 'Alice'}]
      }]
    });

    const view = new ContentElementCommentsView({entry, editor});

    const {getByText} = renderBackboneView(view);

    expect(getByText('Looks good')).toBeInTheDocument();
  });

  it('filters threads by transient state commentThreadIdsAtSelection', () => {
    const entry = createEntry({
      contentElements: [{id: 1, permaId: 10, typeName: 'fixture'}]
    });
    entry.set('selectedContentElementCommentsId', 1);
    entry.contentElements.get(1).transientState
      .set('commentThreadIdsAtSelection', [1]);
    entry.reviewSession = factories.reviewSession({
      commentThreads: [
        {id: 1, subjectType: 'ContentElement', subjectId: 10,
         comments: [{id: 100, body: 'In scope', creatorName: 'Alice'}]},
        {id: 2, subjectType: 'ContentElement', subjectId: 10,
         comments: [{id: 200, body: 'Out of scope', creatorName: 'Bob'}]}
      ]
    });

    const view = new ContentElementCommentsView({entry, editor});

    const {getByText, queryByText} = renderBackboneView(view);

    expect(getByText('In scope')).toBeInTheDocument();
    expect(queryByText('Out of scope')).not.toBeInTheDocument();
  });

  it('shows all threads when transient state has no commentThreadIdsAtSelection', () => {
    const entry = createEntry({
      contentElements: [{id: 1, permaId: 10, typeName: 'fixture'}]
    });
    entry.set('selectedContentElementCommentsId', 1);
    entry.reviewSession = factories.reviewSession({
      commentThreads: [
        {id: 1, subjectType: 'ContentElement', subjectId: 10,
         comments: [{id: 100, body: 'First', creatorName: 'Alice'}]},
        {id: 2, subjectType: 'ContentElement', subjectId: 10,
         comments: [{id: 200, body: 'Second', creatorName: 'Bob'}]}
      ]
    });

    const view = new ContentElementCommentsView({entry, editor});

    const {getByText} = renderBackboneView(view);

    expect(getByText('First')).toBeInTheDocument();
    expect(getByText('Second')).toBeInTheDocument();
  });

  it('updates filter when transient state changes', async () => {
    const entry = createEntry({
      contentElements: [{id: 1, permaId: 10, typeName: 'fixture'}]
    });
    entry.set('selectedContentElementCommentsId', 1);
    entry.reviewSession = factories.reviewSession({
      commentThreads: [
        {id: 1, subjectType: 'ContentElement', subjectId: 10,
         comments: [{id: 100, body: 'In scope', creatorName: 'Alice'}]},
        {id: 2, subjectType: 'ContentElement', subjectId: 10,
         comments: [{id: 200, body: 'Out of scope', creatorName: 'Bob'}]}
      ]
    });

    const view = new ContentElementCommentsView({entry, editor});
    const {getByText, queryByText} = renderBackboneView(view);

    expect(getByText('Out of scope')).toBeInTheDocument();

    act(() => {
      entry.contentElements.get(1).transientState
        .set('commentThreadIdsAtSelection', [1]);
    });

    await waitFor(() => {
      expect(queryByText('Out of scope')).not.toBeInTheDocument();
    });
    expect(getByText('In scope')).toBeInTheDocument();
  });

  it('updates when selectedContentElementCommentsId changes', async () => {
    const entry = createEntry({
      contentElements: [
        {id: 1, permaId: 10, typeName: 'fixture'},
        {id: 2, permaId: 11, typeName: 'fixture'}
      ]
    });
    entry.set('selectedContentElementCommentsId', 1);
    entry.reviewSession = factories.reviewSession({
      commentThreads: [
        {id: 1, subjectType: 'ContentElement', subjectId: 10,
         comments: [{id: 100, body: 'On first', creatorName: 'Alice'}]},
        {id: 2, subjectType: 'ContentElement', subjectId: 11,
         comments: [{id: 200, body: 'On second', creatorName: 'Bob'}]}
      ]
    });

    const view = new ContentElementCommentsView({entry, editor});
    const {getByText, queryByText} = renderBackboneView(view);

    expect(getByText('On first')).toBeInTheDocument();

    act(() => {
      entry.set('selectedContentElementCommentsId', 2);
    });

    await waitFor(() => {
      expect(getByText('On second')).toBeInTheDocument();
    });
    expect(queryByText('On first')).not.toBeInTheDocument();
  });

  it('marks thread matching entry.highlightedThreadId with aria-current when scoped', () => {
    const entry = createEntry({
      contentElements: [{id: 1, permaId: 10, typeName: 'fixture'}]
    });
    entry.set('selectedContentElementCommentsId', 1);
    entry.contentElements.get(1).transientState
      .set('commentThreadIdsAtSelection', [1, 2]);
    entry.set('highlightedThreadId', 2);
    entry.reviewSession = factories.reviewSession({
      commentThreads: [
        {id: 1, subjectType: 'ContentElement', subjectId: 10,
         comments: [{id: 10, body: 'first', creatorName: 'Alice'}]},
        {id: 2, subjectType: 'ContentElement', subjectId: 10,
         comments: [{id: 20, body: 'second', creatorName: 'Bob'}]}
      ]
    });

    const view = new ContentElementCommentsView({entry, editor});
    const {getByText} = renderBackboneView(view);

    expect(getByText('second').closest('[aria-current="true"]')).not.toBeNull();
    expect(getByText('first').closest('[aria-current="true"]')).toBeNull();
  });

  it('updates highlight when entry.highlightedThreadId changes', () => {
    const entry = createEntry({
      contentElements: [{id: 1, permaId: 10, typeName: 'fixture'}]
    });
    entry.set('selectedContentElementCommentsId', 1);
    entry.contentElements.get(1).transientState
      .set('commentThreadIdsAtSelection', [1, 2]);
    entry.reviewSession = factories.reviewSession({
      commentThreads: [
        {id: 1, subjectType: 'ContentElement', subjectId: 10,
         comments: [{id: 10, body: 'first', creatorName: 'Alice'}]},
        {id: 2, subjectType: 'ContentElement', subjectId: 10,
         comments: [{id: 20, body: 'second', creatorName: 'Bob'}]}
      ]
    });

    const view = new ContentElementCommentsView({entry, editor});
    const {getByText} = renderBackboneView(view);

    expect(getByText('first').closest('[aria-current="true"]')).toBeNull();

    act(() => { entry.set('highlightedThreadId', 1); });

    expect(getByText('first').closest('[aria-current="true"]')).not.toBeNull();
  });

  it('triggers selectCommentThread on entry when a thread is clicked while scoped', async () => {
    const user = userEvent.setup();

    const entry = createEntry({
      contentElements: [{id: 1, permaId: 10, typeName: 'fixture'}]
    });
    entry.set('selectedContentElementCommentsId', 1);
    entry.contentElements.get(1).transientState
      .set('commentThreadIdsAtSelection', [7]);
    entry.reviewSession = factories.reviewSession({
      commentThreads: [{
        id: 7, subjectType: 'ContentElement', subjectId: 10,
        comments: [{id: 100, body: 'click me', creatorName: 'Alice'}]
      }]
    });

    const listener = jest.fn();
    entry.on('selectCommentThread', listener);

    const view = new ContentElementCommentsView({entry, editor});
    const {getByText} = renderBackboneView(view);

    await user.click(getByText('click me'));

    expect(listener).toHaveBeenCalledWith(7);
  });

  it('does not highlight or trigger selectCommentThread when not scoped', async () => {
    const user = userEvent.setup();

    const entry = createEntry({
      contentElements: [{id: 1, permaId: 10, typeName: 'fixture'}]
    });
    entry.set('selectedContentElementCommentsId', 1);
    entry.set('highlightedThreadId', 7);
    entry.reviewSession = factories.reviewSession({
      commentThreads: [{
        id: 7, subjectType: 'ContentElement', subjectId: 10,
        comments: [{id: 100, body: 'click me', creatorName: 'Alice'}]
      }]
    });

    const listener = jest.fn();
    entry.on('selectCommentThread', listener);

    const view = new ContentElementCommentsView({entry, editor});
    const {getByText} = renderBackboneView(view);

    expect(getByText('click me').closest('[aria-current="true"]')).toBeNull();

    await user.click(getByText('click me'));

    expect(listener).not.toHaveBeenCalled();
  });

  it("orders threads by the type's compareRanges", () => {
    const entry = createEntry({
      contentElements: [{id: 1, permaId: 10, typeName: 'fixture'}]
    });
    entry.set('selectedContentElementCommentsId', 1);
    entry.reviewSession = factories.reviewSession({
      commentThreads: [
        {id: 1, subjectType: 'ContentElement', subjectId: 10,
         subjectRange: {start: 20},
         comments: [{id: 10, body: 'second', creatorName: 'A'}]},
        {id: 2, subjectType: 'ContentElement', subjectId: 10,
         subjectRange: {start: 10},
         comments: [{id: 20, body: 'first', creatorName: 'B'}]}
      ]
    });

    const view = new ContentElementCommentsView({entry, editor});
    const {getByText} = renderBackboneView(view);

    const order = ['first', 'second']
      .map(text => getByText(text).getBoundingClientRect().top);

    expect(order).toEqual([...order].sort((a, b) => a - b));
  });

  it("orders scoped threads by the type's compareRanges", () => {
    const entry = createEntry({
      contentElements: [{id: 1, permaId: 10, typeName: 'fixture'}]
    });
    entry.set('selectedContentElementCommentsId', 1);
    entry.contentElements.get(1).transientState
      .set('commentThreadIdsAtSelection', [1, 2]);
    entry.reviewSession = factories.reviewSession({
      commentThreads: [
        {id: 1, subjectType: 'ContentElement', subjectId: 10,
         subjectRange: {start: 20},
         comments: [{id: 10, body: 'second', creatorName: 'A'}]},
        {id: 2, subjectType: 'ContentElement', subjectId: 10,
         subjectRange: {start: 10},
         comments: [{id: 20, body: 'first', creatorName: 'B'}]}
      ]
    });

    const view = new ContentElementCommentsView({entry, editor});
    const {getByText} = renderBackboneView(view);

    const order = ['first', 'second']
      .map(text => getByText(text).getBoundingClientRect().top);

    expect(order).toEqual([...order].sort((a, b) => a - b));
  });

  it('does not render the new thread form when selected element has no threads', () => {
    const entry = createEntry({
      contentElements: [{id: 1, permaId: 10, typeName: 'textBlock'}]
    });
    entry.set('selectedContentElementCommentsId', 1);
    entry.reviewSession = factories.reviewSession();

    const view = new ContentElementCommentsView({entry, editor});
    const {queryByPlaceholderText} = renderBackboneView(view);

    expect(queryByPlaceholderText('Add a comment...')).not.toBeInTheDocument();
  });

  it('shows blank slate when selected element has no threads', () => {
    const entry = createEntry({
      contentElements: [{id: 1, permaId: 10, typeName: 'textBlock'}]
    });
    entry.set('selectedContentElementCommentsId', 1);
    entry.reviewSession = factories.reviewSession();

    const view = new ContentElementCommentsView({entry, editor});
    const {getByText} = renderBackboneView(view);

    expect(getByText('No comments yet')).toBeInTheDocument();
  });

  it('does not render a new-topic button', () => {
    const entry = createEntry({
      contentElements: [{id: 1, permaId: 10, typeName: 'fixture'}]
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

    const view = new ContentElementCommentsView({entry, editor});
    const {queryByRole} = renderBackboneView(view);

    expect(queryByRole('button', {name: 'New topic'})).not.toBeInTheDocument();
  });

  it('updates when session emits change:thread', async () => {
    const entry = createEntry({
      contentElements: [{id: 1, permaId: 10, typeName: 'fixture'}]
    });
    entry.set('selectedContentElementCommentsId', 1);
    entry.reviewSession = factories.reviewSession();

    const view = new ContentElementCommentsView({entry, editor});

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
