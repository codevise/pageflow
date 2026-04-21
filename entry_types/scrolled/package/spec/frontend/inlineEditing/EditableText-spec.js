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

      act(() => setSelectionRef({type: 'commentThread', id: 5}));

      expect(container.querySelector(`.${highlightStyles.highlight}`))
        .toHaveClass(highlightStyles.selected);
    });

    it('renders badge in active mode when thread is selected in editor state', () => {
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

      const {getByRole} = renderWithCommenting(
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

      act(() => setSelectionRef({type: 'commentThread', id: 5}));

      expect(getByRole('status')).toHaveClass(badgeStyles.active);
    });

    it('posts SELECTED commentThread message when badge is clicked', () => {
      fakeParentWindow();
      window.parent.postMessage = jest.fn();

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

      fireEvent.click(getByRole('status'));

      expect(window.parent.postMessage).toHaveBeenCalledWith({
        type: 'SELECTED',
        payload: {type: 'commentThread', id: 5}
      }, expect.anything());
    });
  });
});
