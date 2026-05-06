import React, {useEffect} from 'react';
import {DndProvider} from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';

import {features} from 'pageflow/frontend';
import {EditableText} from 'frontend';
import {loadInlineEditingComponents} from 'frontend/inlineEditing';
import {EditorStateProvider, useEditorSelection} from 'frontend/inlineEditing/EditorState';
import {renderWithCommenting} from 'testHelpers/renderWithCommenting';
import {fakeParentWindow} from 'support';

import {render, fireEvent, act} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'

import {commentHighlightStyles as highlightStyles} from 'pageflow-scrolled/review';
import badgeStyles from 'review/Badge.module.css';

describe('EditableText', () => {
  beforeAll(loadInlineEditingComponents);

  beforeAll(() => window.getSelection = function() {});

  const wrapper = ({children}) => (
    <DndProvider backend={HTML5Backend}>
      <EditorStateProvider>{children}</EditorStateProvider>
    </DndProvider>
  );

  it('renders text from value', () => {
    const value = [{
      type: 'heading',
      children: [
        {text: 'Some text'}
      ]
    }];

    const {queryByText} = render(<EditableText value={value} />, {wrapper});

    expect(queryByText('Some text')).toBeInTheDocument()
  });

  it('renders class name', () => {
    const value = [{
      type: 'heading',
      children: [
        {text: 'Some text'}
      ]
    }];

    const {container} = render(
      <EditableText value={value} className="some-class" />, {wrapper}
    );

    expect(container.querySelector('.some-class')).toBeInTheDocument()
  });

  it('uses body scaleCategory by default', () => {
    const value = [{
      type: 'paragraph',
      children: [
        {text: 'Some text'}
      ]
    }];

    const {container} = render(
      <EditableText value={value} />, {wrapper}
    );

    expect(container.querySelector('.typography-body')).toBeInTheDocument()
  });

  it('supports using different scaleCategory', () => {
    const value = [{
      type: 'paragraph',
      children: [
        {text: 'Some text'}
      ]
    }];

    const {container} = render(
      <EditableText value={value} scaleCategory="quoteText-lg" />, {wrapper}
    );

    expect(container.querySelector('.typography-quoteText')).toBeInTheDocument()
  });

  it('supports typography variant prop', () => {
    const value = [{
      type: 'paragraph',
      children: [
        {text: 'Some text'}
      ]
    }];

    const {container} = render(
      <EditableText value={value}
                    scaleCategory="quoteText-lg"
                    typographyVariant="highlight" />,
      {wrapper}
    );

    expect(container.querySelector('.typography-quoteText-highlight')).toBeInTheDocument()
  });

  it('supports typography size prop', () => {
    const value = [{
      type: 'paragraph',
      children: [
        {text: 'Some text'}
      ]
    }];

    const {container} = render(
      <EditableText value={value}
                    scaleCategory="question"
                    typographySize="lg" />,
      {wrapper}
    );

    expect(container.querySelector('.typography-question-lg')).toBeInTheDocument()
  });

  it('renders placeholder if value is undefined', () => {
    const {queryByText} = render(<EditableText placeholder="Some placeholder" />, {wrapper});

    expect(queryByText('Some placeholder')).toBeInTheDocument()
  });

  it('renders placeholder if value is empty', () => {
    const value = [{
      type: 'paragraph',
      children: [
        {text: ''}
      ]
    }];

    const {queryByText} = render(<EditableText value={value}
                                               placeholder="Some placeholder" />,
                                 {wrapper});

    expect(queryByText('Some placeholder')).toBeInTheDocument()
  });

  it('does not render placeholder if value is present', () => {
    const value = [{
      type: 'heading',
      children: [
        {text: 'Some text'}
      ]
    }];

    const {queryByText} = render(<EditableText value={value}
                                               placeholder="Some placeholder" />,
                                {wrapper});

    expect(queryByText('Some placeholder')).not.toBeInTheDocument()
  });

  it('supports rendering custom placeholder class name', () => {
    const {container} = render(
      <EditableText placeholder="Some placeholder"
                    placeholderClassName="custom-placeholder" />,
      {wrapper}
    );

    expect(container.querySelector('.custom-placeholder')).toBeInTheDocument()
  });

  it('does not render custom placeholder class name when not blank', () => {
    const value = [{
      type: 'heading',
      children: [
        {text: 'Some text'}
      ]
    }];

    const {container} = render(
      <EditableText value={value}
                    placeholder="Some placeholder"
                    placeholderClassName="custom-placeholder" />,
      {wrapper}
    );

    expect(container.querySelector('.custom-placeholder')).not.toBeInTheDocument()
  });

  describe('with commenting', () => {
    beforeEach(() => {
      jest.spyOn(features, 'isEnabled').mockImplementation(
        name => name === 'commenting'
      );
    });

    afterEach(() => {
      features.isEnabled.mockRestore();
    });

    it('highlights thread ranges', () => {
      const value = [{type: 'paragraph', children: [{text: 'Some text to comment on'}]}];

      const {container} = renderWithCommenting(
        <EditableText value={value} contentElementId={1} />,
        {
          wrapper,
          commentThreads: [{
            id: 1,
            subjectType: 'ContentElement',
            subjectId: 10,
            subjectRange: {anchor: {path: [0, 0], offset: 5}, focus: {path: [0, 0], offset: 9}},
            comments: [{id: 1, body: 'A comment', creatorName: 'Alice', creatorId: 1}]
          }]
        }
      );

      const highlight = container.querySelector(`.${highlightStyles.highlight}`);
      expect(highlight).toBeInTheDocument();
      expect(highlight).toHaveTextContent('text');
    });

    it('renders badge in dot mode by default', () => {
      const value = [{type: 'paragraph', children: [{text: 'Some text to comment on'}]}];

      const {getByRole} = renderWithCommenting(
        <EditableText value={value} contentElementId={1} />,
        {
          wrapper,
          commentThreads: [{
            id: 5,
            subjectType: 'ContentElement',
            subjectId: 10,
            subjectRange: {anchor: {path: [0, 0], offset: 5}, focus: {path: [0, 0], offset: 9}},
            comments: [{id: 1, body: 'A comment', creatorName: 'Alice', creatorId: 1}]
          }]
        }
      );

      expect(getByRole('status')).toHaveClass(badgeStyles.dot);
    });

    it('highlights pending new thread range from editor state', () => {
      let setSelectionRef;
      function SelectionCapture({children}) {
        const {select} = useEditorSelection();
        useEffect(() => {
          setSelectionRef = select;
        }, [select]);
        return children;
      }

      const selectionWrapper = ({children}) => wrapper({
        children: <SelectionCapture>{children}</SelectionCapture>
      });

      const value = [{type: 'paragraph', children: [{text: 'Some text to comment on'}]}];

      const {container} = renderWithCommenting(
        <EditableText value={value} contentElementId={1} />,
        {wrapper: selectionWrapper}
      );

      expect(container.querySelector(`.${highlightStyles.highlight}`))
        .not.toBeInTheDocument();

      act(() => setSelectionRef({
        type: 'newThread',
        id: 10,
        subjectType: 'ContentElement',
        range: {anchor: {path: [0, 0], offset: 5}, focus: {path: [0, 0], offset: 9}}
      }));

      const highlight = container.querySelector(`.${highlightStyles.highlight}`);
      expect(highlight).toBeInTheDocument();
      expect(highlight).toHaveTextContent('text');
      expect(highlight).toHaveClass(highlightStyles.selected);

      const badge = document.querySelector(`[role="status"]`);
      expect(badge).toHaveClass(badgeStyles.active);
    });

    it('applies selected style to highlight when thread is selected in editor state', () => {
      let setSelectionRef;
      function SelectionCapture({children}) {
        const {select} = useEditorSelection();
        useEffect(() => {
          setSelectionRef = select;
        }, [select]);
        return children;
      }

      const selectionWrapper = ({children}) => wrapper({
        children: <SelectionCapture>{children}</SelectionCapture>
      });

      const value = [{type: 'paragraph', children: [{text: 'Some text to comment on'}]}];

      const {container} = renderWithCommenting(
        <EditableText value={value} contentElementId={1} />,
        {
          wrapper: selectionWrapper,
          commentThreads: [{
            id: 5,
            subjectType: 'ContentElement',
            subjectId: 10,
            subjectRange: {anchor: {path: [0, 0], offset: 5}, focus: {path: [0, 0], offset: 9}},
            comments: [{id: 1, body: 'A comment', creatorName: 'Alice', creatorId: 1}]
          }]
        }
      );

      expect(container.querySelector(`.${highlightStyles.highlight}`))
        .not.toHaveClass(highlightStyles.selected);

      act(() => setSelectionRef({
        type: 'contentElementComments', id: 1, highlightedThreadId: 5
      }));

      expect(container.querySelector(`.${highlightStyles.highlight}`))
        .toHaveClass(highlightStyles.selected);
    });

    it('renders only the highlighted thread badge in active mode', () => {
      let setSelectionRef;
      function SelectionCapture({children}) {
        const {select} = useEditorSelection();
        useEffect(() => {
          setSelectionRef = select;
        }, [select]);
        return children;
      }

      const selectionWrapper = ({children}) => wrapper({
        children: <SelectionCapture>{children}</SelectionCapture>
      });

      const value = [
        {type: 'paragraph', children: [{text: 'First paragraph thread here'}]},
        {type: 'paragraph', children: [{text: 'Second paragraph thread here'}]}
      ];

      const {getAllByRole} = renderWithCommenting(
        <EditableText value={value} contentElementId={1} />,
        {
          wrapper: selectionWrapper,
          commentThreads: [
            {id: 5, subjectType: 'ContentElement', subjectId: 10,
             subjectRange: {anchor: {path: [0, 0], offset: 0}, focus: {path: [0, 0], offset: 5}},
             comments: [{id: 1, body: 'first', creatorName: 'Alice', creatorId: 1}]},
            {id: 7, subjectType: 'ContentElement', subjectId: 10,
             subjectRange: {anchor: {path: [1, 0], offset: 0}, focus: {path: [1, 0], offset: 6}},
             comments: [{id: 2, body: 'second', creatorName: 'Bob', creatorId: 2}]}
          ]
        }
      );

      act(() => setSelectionRef({
        type: 'contentElementComments', id: 1, highlightedThreadId: 5
      }));

      const badges = getAllByRole('status');
      expect(badges).toHaveLength(2);
      expect(badges[0]).toHaveClass(badgeStyles.active);
      expect(badges[1]).not.toHaveClass(badgeStyles.active);
    });

    it('renders sibling badge in regular mode when in same block as highlighted thread', () => {
      let setSelectionRef;
      function SelectionCapture({children}) {
        const {select} = useEditorSelection();
        useEffect(() => {
          setSelectionRef = select;
        }, [select]);
        return children;
      }

      const selectionWrapper = ({children}) => wrapper({
        children: <SelectionCapture>{children}</SelectionCapture>
      });

      const value = [
        {type: 'paragraph', children: [{text: 'First paragraph with two threads'}]},
        {type: 'paragraph', children: [{text: 'Second paragraph thread'}]}
      ];

      const {getAllByRole} = renderWithCommenting(
        <EditableText value={value} contentElementId={1} />,
        {
          wrapper: selectionWrapper,
          commentThreads: [
            {id: 5, subjectType: 'ContentElement', subjectId: 10,
             subjectRange: {anchor: {path: [0, 0], offset: 0}, focus: {path: [0, 0], offset: 5}},
             comments: [{id: 1, body: 'a', creatorName: 'Alice', creatorId: 1}]},
            {id: 6, subjectType: 'ContentElement', subjectId: 10,
             subjectRange: {anchor: {path: [0, 0], offset: 6}, focus: {path: [0, 0], offset: 9}},
             comments: [{id: 2, body: 'b', creatorName: 'Bob', creatorId: 2}]},
            {id: 7, subjectType: 'ContentElement', subjectId: 10,
             subjectRange: {anchor: {path: [1, 0], offset: 0}, focus: {path: [1, 0], offset: 6}},
             comments: [{id: 3, body: 'c', creatorName: 'Eve', creatorId: 3}]}
          ]
        }
      );

      act(() => setSelectionRef({
        type: 'contentElementComments', id: 1, highlightedThreadId: 5
      }));

      const badges = getAllByRole('status');
      expect(badges).toHaveLength(3);
      expect(badges[0]).toHaveClass(badgeStyles.active);
      expect(badges[1]).not.toHaveClass(badgeStyles.dot);
      expect(badges[2]).toHaveClass(badgeStyles.dot);
    });

    it('posts SELECTED contentElementComments with overlapping threadIds on badge click', () => {
      fakeParentWindow();
      window.parent.postMessage = jest.fn();

      const value = [
        {type: 'paragraph', children: [{text: 'First paragraph'}]},
        {type: 'paragraph', children: [{text: 'Second paragraph'}]}
      ];

      const {getAllByRole} = renderWithCommenting(
        <EditableText value={value} contentElementId={1} />,
        {
          wrapper,
          commentThreads: [
            {id: 5, subjectType: 'ContentElement', subjectId: 10,
             subjectRange: {anchor: {path: [0, 0], offset: 0}, focus: {path: [0, 0], offset: 5}},
             comments: [{id: 1, body: 'p0a', creatorName: 'Alice', creatorId: 1}]},
            {id: 6, subjectType: 'ContentElement', subjectId: 10,
             subjectRange: {anchor: {path: [0, 0], offset: 6}, focus: {path: [0, 0], offset: 9}},
             comments: [{id: 2, body: 'p0b', creatorName: 'Bob', creatorId: 2}]},
            {id: 7, subjectType: 'ContentElement', subjectId: 10,
             subjectRange: {anchor: {path: [1, 0], offset: 0}, focus: {path: [1, 0], offset: 6}},
             comments: [{id: 3, body: 'p1', creatorName: 'Eve', creatorId: 3}]}
          ]
        }
      );

      const badges = getAllByRole('status');
      fireEvent.click(badges[0]);

      expect(window.parent.postMessage).toHaveBeenCalledWith({
        type: 'SELECTED',
        payload: {
          type: 'contentElementComments',
          id: 1,
          highlightedThreadId: 5,
          threadIds: [5, 6]
        }
      }, expect.anything());
    });

    it('scopes threadIds to clicked highlight\'s start block, ignoring later blocks it spans', () => {
      fakeParentWindow();
      window.parent.postMessage = jest.fn();

      const value = [
        {type: 'paragraph', children: [{text: 'First paragraph'}]},
        {type: 'paragraph', children: [{text: 'Second paragraph'}]}
      ];

      const {getAllByRole} = renderWithCommenting(
        <EditableText value={value} contentElementId={1} />,
        {
          wrapper,
          commentThreads: [
            {id: 5, subjectType: 'ContentElement', subjectId: 10,
             subjectRange: {anchor: {path: [0, 0], offset: 0}, focus: {path: [1, 0], offset: 6}},
             comments: [{id: 1, body: 'spans', creatorName: 'Alice', creatorId: 1}]},
            {id: 7, subjectType: 'ContentElement', subjectId: 10,
             subjectRange: {anchor: {path: [1, 0], offset: 7}, focus: {path: [1, 0], offset: 16}},
             comments: [{id: 2, body: 'p1', creatorName: 'Eve', creatorId: 2}]}
          ]
        }
      );

      const badges = getAllByRole('status');
      fireEvent.click(badges[0]);

      expect(window.parent.postMessage).toHaveBeenCalledWith({
        type: 'SELECTED',
        payload: {
          type: 'contentElementComments',
          id: 1,
          highlightedThreadId: 5,
          threadIds: [5]
        }
      }, expect.anything());
    });

    it('runs badge click logic on SELECT_COMMENT_THREAD message', () => {
      fakeParentWindow();
      window.parent.postMessage = jest.fn();

      const subjectRange = {anchor: {path: [0, 0], offset: 0}, focus: {path: [0, 0], offset: 5}};
      const value = [{type: 'paragraph', children: [{text: 'Some text to comment on'}]}];

      renderWithCommenting(
        <EditableText value={value} contentElementId={1} />,
        {
          wrapper,
          commentThreads: [{
            id: 9,
            subjectType: 'ContentElement',
            subjectId: 10,
            subjectRange,
            comments: [{id: 1, body: 'A comment', creatorName: 'Alice', creatorId: 1}]
          }]
        }
      );

      window.parent.postMessage.mockClear();

      act(() => {
        window.postMessage({
          type: 'SELECT_COMMENT_THREAD',
          payload: {threadId: 9}
        }, '*');
      });

      return expect(new Promise(resolve => {
        const original = window.parent.postMessage;
        window.parent.postMessage = (data, ...rest) => {
          original(data, ...rest);
          if (data.type === 'SELECTED' && data.payload.type === 'contentElementComments') {
            resolve(data);
          }
        };
      })).resolves.toMatchObject({
        type: 'SELECTED',
        payload: {type: 'contentElementComments', id: 1, highlightedThreadId: 9}
      });
    });
  });
});
