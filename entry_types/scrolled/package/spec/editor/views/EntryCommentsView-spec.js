import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import {act} from '@testing-library/react';

import {editor} from 'pageflow-scrolled/editor';

import {EntryCommentsView} from 'editor/views/EntryCommentsView';
import styles from 'editor/views/EntryCommentsView.module.css';

import {factories, useFakeTranslations, renderBackboneView} from 'pageflow/testHelpers';
import {useEditorGlobals} from 'support';

describe('EntryCommentsView', () => {
  const {createEntry} = useEditorGlobals();

  beforeAll(() => {
    editor.contentElementTypes.register('fixture', {
      compareRanges: (a, b) => (a?.start ?? 0) - (b?.start ?? 0)
    });
  });

  useFakeTranslations({
    'pageflow_scrolled.review.new_topic': 'New topic',
    'pageflow_scrolled.review.add_comment_placeholder': 'Add a comment...',
    'pageflow_scrolled.review.reply_placeholder': 'Reply...',
    'pageflow_scrolled.review.send': 'Send',
    'pageflow_scrolled.editor.content_elements.textBlock.name': 'Text',
    'pageflow_scrolled.editor.content_elements.image.name': 'Image',
    'pageflow_scrolled.editor.comments_view.section': 'Section',
    'pageflow_scrolled.editor.chapter_item.chapter': 'Chapter',
    'pageflow_scrolled.editor.chapter_item.excursion': 'Excursion'
  });

  it('renders a chapter heading with number and title above its groups', () => {
    const entry = createEntry({
      chapters: [
        {id: 1, permaId: 10, storylineId: 1000, position: 0, configuration: {title: 'Intro'}}
      ],
      sections: [{id: 1, permaId: 100, chapterId: 1, position: 0}],
      contentElements: [{id: 1, permaId: 1000, sectionId: 1, typeName: 'image'}]
    });
    entry.reviewSession = factories.reviewSession({
      commentThreads: [{
        id: 1, subjectType: 'ContentElement', subjectId: 1000,
        comments: [{id: 100, body: 'A comment', creatorName: 'Alice'}]
      }]
    });

    const view = new EntryCommentsView({entry, editor});
    const {getByText} = renderBackboneView(view);

    const heading = getByText('Intro');
    const comment = getByText('A comment');

    expect(getByText('Chapter 1')).toBeInTheDocument();
    expect(heading.compareDocumentPosition(comment) &
           Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it('groups excursion chapters below main chapters', () => {
    const entry = createEntry({
      storylines: [
        {id: 1000, permaId: 100, position: 0, configuration: {main: true}},
        {id: 2000, permaId: 200, position: 1, configuration: {}}
      ],
      chapters: [
        {id: 1, permaId: 10, storylineId: 1000, position: 0, configuration: {title: 'Main chapter'}},
        {id: 2, permaId: 20, storylineId: 2000, position: 0, configuration: {title: 'My excursion'}}
      ],
      sections: [
        {id: 1, permaId: 100, chapterId: 1, position: 0},
        {id: 2, permaId: 200, chapterId: 2, position: 0}
      ],
      contentElements: [
        {id: 1, permaId: 1000, sectionId: 1, typeName: 'image'},
        {id: 2, permaId: 2000, sectionId: 2, typeName: 'image'}
      ]
    });
    entry.reviewSession = factories.reviewSession({
      commentThreads: [
        {id: 1, subjectType: 'ContentElement', subjectId: 1000,
         comments: [{id: 1, body: 'in main', creatorName: 'A'}]},
        {id: 2, subjectType: 'ContentElement', subjectId: 2000,
         comments: [{id: 2, body: 'in excursion', creatorName: 'B'}]}
      ]
    });

    const view = new EntryCommentsView({entry, editor});
    const {getByText} = renderBackboneView(view);

    const mainComment = getByText('in main');
    const excursionHeading = getByText('My excursion');
    const excursionComment = getByText('in excursion');

    expect(getByText('Excursion')).toBeInTheDocument();
    expect(mainComment.compareDocumentPosition(excursionHeading) &
           Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(mainComment.compareDocumentPosition(excursionComment) &
           Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it('does not render a heading for a chapter without threads', () => {
    const entry = createEntry({
      chapters: [
        {id: 1, permaId: 10, storylineId: 1000, position: 0, configuration: {title: 'Has comments'}},
        {id: 2, permaId: 20, storylineId: 1000, position: 1, configuration: {title: 'Empty chapter'}}
      ],
      sections: [
        {id: 1, permaId: 100, chapterId: 1, position: 0},
        {id: 2, permaId: 200, chapterId: 2, position: 0}
      ],
      contentElements: [
        {id: 1, permaId: 1000, sectionId: 1, typeName: 'image'},
        {id: 2, permaId: 2000, sectionId: 2, typeName: 'image'}
      ]
    });
    entry.reviewSession = factories.reviewSession({
      commentThreads: [{
        id: 1, subjectType: 'ContentElement', subjectId: 1000,
        comments: [{id: 1, body: 'a comment', creatorName: 'A'}]
      }]
    });

    const view = new EntryCommentsView({entry, editor});
    const {getByText, queryByText} = renderBackboneView(view);

    expect(getByText('Has comments')).toBeInTheDocument();
    expect(queryByText('Empty chapter')).not.toBeInTheDocument();
  });

  it('renders a thread group only for content elements that have threads', () => {
    const entry = createEntry({
      contentElements: [
        {id: 1, permaId: 10, typeName: 'textBlock', position: 0},
        {id: 2, permaId: 20, typeName: 'image', position: 1}
      ]
    });
    entry.reviewSession = factories.reviewSession({
      commentThreads: [{
        id: 1,
        subjectType: 'ContentElement',
        subjectId: 20,
        comments: [{id: 100, body: 'Looks good', creatorName: 'Alice'}]
      }]
    });

    const view = new EntryCommentsView({entry, editor});

    const {getByText, queryByText} = renderBackboneView(view);

    expect(getByText('Looks good')).toBeInTheDocument();
    expect(getByText('Image')).toBeInTheDocument();
    expect(queryByText('Text')).not.toBeInTheDocument();
  });

  it('orders groups by chapter, section and content element position', () => {
    const entry = createEntry({
      chapters: [
        {id: 100, permaId: 10, position: 1, storylineId: 1000},
        {id: 200, permaId: 20, position: 0, storylineId: 1000}
      ],
      sections: [
        {id: 11, permaId: 11, chapterId: 100, position: 0},
        {id: 12, permaId: 12, chapterId: 100, position: 1},
        {id: 21, permaId: 21, chapterId: 200, position: 0}
      ],
      contentElements: [
        {id: 1, permaId: 1, sectionId: 11, position: 1, typeName: 'textBlock'},
        {id: 2, permaId: 2, sectionId: 11, position: 0, typeName: 'image'},
        {id: 3, permaId: 3, sectionId: 12, position: 0, typeName: 'textBlock'},
        {id: 4, permaId: 4, sectionId: 21, position: 0, typeName: 'image'}
      ]
    });
    entry.reviewSession = factories.reviewSession({
      commentThreads: [
        {id: 1, subjectType: 'ContentElement', subjectId: 1,
         comments: [{id: 1, body: 'fourth', creatorName: 'A'}]},
        {id: 2, subjectType: 'ContentElement', subjectId: 2,
         comments: [{id: 2, body: 'third', creatorName: 'B'}]},
        {id: 3, subjectType: 'ContentElement', subjectId: 3,
         comments: [{id: 3, body: 'second', creatorName: 'C'}]},
        {id: 4, subjectType: 'ContentElement', subjectId: 4,
         comments: [{id: 4, body: 'first', creatorName: 'D'}]}
      ]
    });

    const view = new EntryCommentsView({entry, editor});

    const {getByText} = renderBackboneView(view);

    const order = ['first', 'second', 'third', 'fourth']
      .map(text => getByText(text).getBoundingClientRect().top);

    expect(order).toEqual([...order].sort((a, b) => a - b));
  });

  it('does not render the new-topic button', () => {
    const entry = createEntry({
      contentElements: [{id: 1, permaId: 10, typeName: 'textBlock'}]
    });
    entry.reviewSession = factories.reviewSession({
      commentThreads: [{
        id: 1, subjectType: 'ContentElement', subjectId: 10,
        comments: [{id: 100, body: 'A comment', creatorName: 'Alice'}]
      }]
    });

    const view = new EntryCommentsView({entry, editor});
    const {queryByRole} = renderBackboneView(view);

    expect(queryByRole('button', {name: 'New topic'})).not.toBeInTheDocument();
  });

  it('triggers selectCommentThread on entry when a thread is clicked', async () => {
    const user = userEvent.setup();

    const entry = createEntry({
      contentElements: [{id: 1, permaId: 10, typeName: 'textBlock'}]
    });
    entry.reviewSession = factories.reviewSession({
      commentThreads: [{
        id: 7, subjectType: 'ContentElement', subjectId: 10,
        comments: [{id: 100, body: 'A comment', creatorName: 'Alice'}]
      }]
    });

    const listener = jest.fn();
    entry.on('selectCommentThread', listener);

    const view = new EntryCommentsView({entry, editor});
    const {getByText} = renderBackboneView(view);

    await user.click(getByText('A comment'));

    expect(listener).toHaveBeenCalledWith(7);
  });

  it('marks the thread matching entry.highlightedThreadId with aria-current', () => {
    const entry = createEntry({
      contentElements: [{id: 1, permaId: 10, typeName: 'textBlock'}]
    });
    entry.reviewSession = factories.reviewSession({
      commentThreads: [
        {id: 1, subjectType: 'ContentElement', subjectId: 10,
         comments: [{id: 10, body: 'first', creatorName: 'Alice'}]},
        {id: 2, subjectType: 'ContentElement', subjectId: 10,
         comments: [{id: 20, body: 'second', creatorName: 'Bob'}]}
      ]
    });
    entry.set('highlightedThreadId', 2);

    const view = new EntryCommentsView({entry, editor});
    const {getByText} = renderBackboneView(view);

    expect(getByText('second').closest('[aria-current="true"]')).not.toBeNull();
    expect(getByText('first').closest('[aria-current="true"]')).toBeNull();
  });

  it('updates highlight when entry.highlightedThreadId changes', () => {
    const entry = createEntry({
      contentElements: [{id: 1, permaId: 10, typeName: 'textBlock'}]
    });
    entry.reviewSession = factories.reviewSession({
      commentThreads: [
        {id: 1, subjectType: 'ContentElement', subjectId: 10,
         comments: [{id: 10, body: 'first', creatorName: 'Alice'}]},
        {id: 2, subjectType: 'ContentElement', subjectId: 10,
         comments: [{id: 20, body: 'second', creatorName: 'Bob'}]}
      ]
    });

    const view = new EntryCommentsView({entry, editor});
    const {getByText} = renderBackboneView(view);

    expect(getByText('first').closest('[aria-current="true"]')).toBeNull();

    act(() => { entry.set('highlightedThreadId', 1); });

    expect(getByText('first').closest('[aria-current="true"]')).not.toBeNull();
  });

  it("highlights all threads of the selected element when it has no commentThreadIdsAtSelection", () => {
    const entry = createEntry({
      contentElements: [
        {id: 1, permaId: 10, typeName: 'image'},
        {id: 2, permaId: 11, typeName: 'image'}
      ]
    });
    entry.set('selectedCommentsSubject', {subjectType: 'ContentElement', id: 1});
    entry.reviewSession = factories.reviewSession({
      commentThreads: [
        {id: 1, subjectType: 'ContentElement', subjectId: 10,
         comments: [{id: 10, body: 'on selected one', creatorName: 'A'}]},
        {id: 2, subjectType: 'ContentElement', subjectId: 10,
         comments: [{id: 20, body: 'on selected two', creatorName: 'B'}]},
        {id: 3, subjectType: 'ContentElement', subjectId: 11,
         comments: [{id: 30, body: 'on other', creatorName: 'C'}]}
      ]
    });

    const view = new EntryCommentsView({entry, editor});
    const {getByText} = renderBackboneView(view);

    expect(getByText('on selected one').closest('[aria-current="true"]')).not.toBeNull();
    expect(getByText('on selected two').closest('[aria-current="true"]')).not.toBeNull();
    expect(getByText('on other').closest('[aria-current="true"]')).toBeNull();
  });

  it("falls back to highlightedThreadId when the selected element has commentThreadIdsAtSelection", () => {
    const entry = createEntry({
      contentElements: [{id: 1, permaId: 10, typeName: 'textBlock'}]
    });
    entry.set('selectedCommentsSubject', {subjectType: 'ContentElement', id: 1});
    entry.contentElements.get(1).transientState
      .set('commentThreadIdsAtSelection', [2]);
    entry.set('highlightedThreadId', 2);
    entry.reviewSession = factories.reviewSession({
      commentThreads: [
        {id: 1, subjectType: 'ContentElement', subjectId: 10,
         comments: [{id: 10, body: 'first', creatorName: 'A'}]},
        {id: 2, subjectType: 'ContentElement', subjectId: 10,
         comments: [{id: 20, body: 'second', creatorName: 'B'}]}
      ]
    });

    const view = new EntryCommentsView({entry, editor});
    const {getByText} = renderBackboneView(view);

    expect(getByText('first').closest('[aria-current="true"]')).toBeNull();
    expect(getByText('second').closest('[aria-current="true"]')).not.toBeNull();
  });

  it('updates highlights when selectedCommentsSubject changes', () => {
    const entry = createEntry({
      contentElements: [
        {id: 1, permaId: 10, typeName: 'image'},
        {id: 2, permaId: 11, typeName: 'image'}
      ]
    });
    entry.reviewSession = factories.reviewSession({
      commentThreads: [
        {id: 1, subjectType: 'ContentElement', subjectId: 10,
         comments: [{id: 10, body: 'on one', creatorName: 'A'}]},
        {id: 2, subjectType: 'ContentElement', subjectId: 11,
         comments: [{id: 20, body: 'on two', creatorName: 'B'}]}
      ]
    });

    const view = new EntryCommentsView({entry, editor});
    const {getByText} = renderBackboneView(view);

    expect(getByText('on one').closest('[aria-current="true"]')).toBeNull();
    expect(getByText('on two').closest('[aria-current="true"]')).toBeNull();

    act(() => { entry.set('selectedCommentsSubject', {subjectType: 'ContentElement', id: 2}); });

    expect(getByText('on one').closest('[aria-current="true"]')).toBeNull();
    expect(getByText('on two').closest('[aria-current="true"]')).not.toBeNull();
  });

  it('only shows reply form on the highlighted thread', () => {
    const entry = createEntry({
      contentElements: [{id: 1, permaId: 10, typeName: 'textBlock'}]
    });
    entry.reviewSession = factories.reviewSession({
      commentThreads: [
        {id: 1, subjectType: 'ContentElement', subjectId: 10,
         comments: [{id: 10, body: 'first', creatorName: 'Alice'}]},
        {id: 2, subjectType: 'ContentElement', subjectId: 10,
         comments: [{id: 20, body: 'second', creatorName: 'Bob'}]}
      ]
    });
    entry.set('highlightedThreadId', 2);

    const view = new EntryCommentsView({entry, editor});
    const {getByText, queryAllByPlaceholderText} = renderBackboneView(view);

    const replyInputs = queryAllByPlaceholderText('Reply...');
    expect(replyInputs).toHaveLength(1);
    expect(getByText('second').closest('[aria-current="true"]'))
      .toContainElement(replyInputs[0]);
  });

  it("orders threads within a group by the type's compareRanges", () => {
    const entry = createEntry({
      contentElements: [{id: 1, permaId: 10, typeName: 'fixture'}]
    });
    entry.reviewSession = factories.reviewSession({
      commentThreads: [
        {id: 1, subjectType: 'ContentElement', subjectId: 10,
         subjectRange: {start: 30},
         comments: [{id: 10, body: 'third', creatorName: 'A'}]},
        {id: 2, subjectType: 'ContentElement', subjectId: 10,
         subjectRange: {start: 10},
         comments: [{id: 20, body: 'first', creatorName: 'B'}]},
        {id: 3, subjectType: 'ContentElement', subjectId: 10,
         subjectRange: {start: 20},
         comments: [{id: 30, body: 'second', creatorName: 'C'}]}
      ]
    });

    const view = new EntryCommentsView({entry, editor});
    const {getByText} = renderBackboneView(view);

    const order = ['first', 'second', 'third']
      .map(text => getByText(text).getBoundingClientRect().top);

    expect(order).toEqual([...order].sort((a, b) => a - b));
  });

  it('shows the content element type name as group label', () => {
    const entry = createEntry({
      contentElements: [{id: 1, permaId: 10, typeName: 'image'}]
    });
    entry.reviewSession = factories.reviewSession({
      commentThreads: [{
        id: 1, subjectType: 'ContentElement', subjectId: 10,
        comments: [{id: 100, body: 'A comment', creatorName: 'Alice'}]
      }]
    });

    const view = new EntryCommentsView({entry, editor});
    const {getByText} = renderBackboneView(view);

    expect(getByText('Image')).toBeInTheDocument();
  });

  it('renders the registered pictogram for the content element type', () => {
    editor.contentElementTypes.register('image', {pictogram: '/some/image-pictogram.svg'});

    const entry = createEntry({
      contentElements: [{id: 1, permaId: 10, typeName: 'image'}]
    });
    entry.reviewSession = factories.reviewSession({
      commentThreads: [{
        id: 1, subjectType: 'ContentElement', subjectId: 10,
        comments: [{id: 100, body: 'A comment', creatorName: 'Alice'}]
      }]
    });

    const view = new EntryCommentsView({entry, editor});
    renderBackboneView(view);

    const pictogram = view.el.querySelector(`.${styles.pictogram}`);
    expect(pictogram).toBeInTheDocument();
    expect(pictogram.style.maskImage).toContain('/some/image-pictogram.svg');
  });

  it('falls back to the default pictogram for unknown content element types', () => {
    const entry = createEntry({
      contentElements: [{id: 1, permaId: 10, typeName: 'unregistered'}]
    });
    entry.reviewSession = factories.reviewSession({
      commentThreads: [{
        id: 1, subjectType: 'ContentElement', subjectId: 10,
        comments: [{id: 100, body: 'A comment', creatorName: 'Alice'}]
      }]
    });

    const view = new EntryCommentsView({entry, editor});
    renderBackboneView(view);

    const pictogram = view.el.querySelector(`.${styles.pictogram}`);
    expect(pictogram).toBeInTheDocument();
    expect(pictogram.style.maskImage).not.toBe('');
  });

  it('renders a section thread group with a label-only separator', () => {
    const entry = createEntry({
      sections: [{id: 1, permaId: 10}],
      contentElements: [{id: 1, permaId: 100, sectionId: 1, typeName: 'image'}]
    });
    entry.reviewSession = factories.reviewSession({
      commentThreads: [{
        id: 1, subjectType: 'Section', subjectId: 10,
        comments: [{id: 100, body: 'On the section', creatorName: 'Alice'}]
      }]
    });

    const view = new EntryCommentsView({entry, editor});
    const {getByText} = renderBackboneView(view);

    expect(getByText('On the section')).toBeInTheDocument();
    expect(getByText('Section')).toBeInTheDocument();
    expect(view.el.querySelector(`.${styles.pictogram}`)).toBeNull();
  });

  it("renders a section's comments above its content element comments", () => {
    const entry = createEntry({
      sections: [{id: 1, permaId: 10}],
      contentElements: [{id: 1, permaId: 100, sectionId: 1, typeName: 'image'}]
    });
    entry.reviewSession = factories.reviewSession({
      commentThreads: [
        {id: 1, subjectType: 'ContentElement', subjectId: 100,
         comments: [{id: 1, body: 'on element', creatorName: 'A'}]},
        {id: 2, subjectType: 'Section', subjectId: 10,
         comments: [{id: 2, body: 'on section', creatorName: 'B'}]}
      ]
    });

    const view = new EntryCommentsView({entry, editor});
    const {getByText} = renderBackboneView(view);

    const sectionComment = getByText('on section');
    const elementComment = getByText('on element');

    expect(sectionComment.compareDocumentPosition(elementComment) &
           Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it('does not render a section group when the section has no threads', () => {
    const entry = createEntry({
      sections: [{id: 1, permaId: 10}],
      contentElements: [{id: 1, permaId: 100, sectionId: 1, typeName: 'image'}]
    });
    entry.reviewSession = factories.reviewSession({
      commentThreads: [{
        id: 1, subjectType: 'ContentElement', subjectId: 100,
        comments: [{id: 100, body: 'on element', creatorName: 'Alice'}]
      }]
    });

    const view = new EntryCommentsView({entry, editor});
    const {queryByText} = renderBackboneView(view);

    expect(queryByText('on element')).toBeInTheDocument();
    expect(queryByText('Section')).not.toBeInTheDocument();
  });

  it('highlights all threads of the selected section', () => {
    const entry = createEntry({
      sections: [{id: 1, permaId: 10}, {id: 2, permaId: 20}]
    });
    entry.set('selectedCommentsSubject', {subjectType: 'Section', id: 1});
    entry.reviewSession = factories.reviewSession({
      commentThreads: [
        {id: 1, subjectType: 'Section', subjectId: 10,
         comments: [{id: 10, body: 'on selected one', creatorName: 'A'}]},
        {id: 2, subjectType: 'Section', subjectId: 10,
         comments: [{id: 20, body: 'on selected two', creatorName: 'B'}]},
        {id: 3, subjectType: 'Section', subjectId: 20,
         comments: [{id: 30, body: 'on other', creatorName: 'C'}]}
      ]
    });

    const view = new EntryCommentsView({entry, editor});
    const {getByText} = renderBackboneView(view);

    expect(getByText('on selected one').closest('[aria-current="true"]')).not.toBeNull();
    expect(getByText('on selected two').closest('[aria-current="true"]')).not.toBeNull();
    expect(getByText('on other').closest('[aria-current="true"]')).toBeNull();
  });
});
