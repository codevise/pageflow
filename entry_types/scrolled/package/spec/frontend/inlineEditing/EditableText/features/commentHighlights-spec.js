import React, {useEffect} from 'react';

import {features} from 'pageflow/frontend';
import {EditableText} from 'frontend';
import {useEditorSelection} from 'frontend/inlineEditing/EditorState';
import {renderEntry, useInlineEditingPageObjects} from 'support/pageObjects/inlineEditing';

import {act} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import {commentHighlightStyles as highlightStyles} from 'pageflow-scrolled/review';

describe('inline editing EditableText comment highlights', () => {
  useInlineEditingPageObjects();

  beforeAll(() => window.getSelection = function() {});

  beforeEach(() => {
    jest.spyOn(features, 'isEnabled').mockImplementation(
      name => name === 'commenting'
    );
  });

  afterEach(() => {
    features.isEnabled.mockRestore();
  });

  const value = [{type: 'paragraph', children: [{text: 'Some text to comment on'}]}];
  const subjectRange = {anchor: {path: [0, 0], offset: 5}, focus: {path: [0, 0], offset: 9}};

  it('highlights thread ranges', () => {
    const entry = renderEntry({
      contentElement: {
        ui: <EditableText value={value} />,
        typeOptions: {inlineComments: true}
      },
      commenting: {
        currentUser: null,
        commentThreads: [{
          id: 1,
          subjectType: 'ContentElement',
          subjectId: 10,
          subjectRange,
          comments: [{id: 1, body: 'A comment', creatorName: 'Alice', creatorId: 1}]
        }]
      }
    });

    const highlight = entry.container.querySelector(`.${highlightStyles.highlight}`);
    expect(highlight).toBeInTheDocument();
    expect(highlight).toHaveTextContent('text');
  });

  it('highlights pending new thread range from editor state', () => {
    let setSelectionRef;
    function SelectionCapture({children}) {
      const {select} = useEditorSelection();
      useEffect(() => { setSelectionRef = select; }, [select]);
      return children;
    }

    const entry = renderEntry({
      contentElement: {
        ui: <SelectionCapture><EditableText value={value} /></SelectionCapture>,
        typeOptions: {inlineComments: true}
      }
    });

    expect(entry.container.querySelector(`.${highlightStyles.highlight}`))
      .not.toBeInTheDocument();

    act(() => setSelectionRef({
      type: 'newThread',
      id: 10,
      subjectType: 'ContentElement',
      range: subjectRange
    }));

    const highlight = entry.container.querySelector(`.${highlightStyles.highlight}`);
    expect(highlight).toBeInTheDocument();
    expect(highlight).toHaveTextContent('text');
    expect(highlight).toHaveClass(highlightStyles.selected);
  });

  it('applies selected style to highlight when thread is selected in editor state', () => {
    let setSelectionRef;
    function SelectionCapture({children}) {
      const {select} = useEditorSelection();
      useEffect(() => { setSelectionRef = select; }, [select]);
      return children;
    }

    const entry = renderEntry({
      contentElement: {
        ui: <SelectionCapture><EditableText value={value} /></SelectionCapture>,
        typeOptions: {inlineComments: true}
      },
      commenting: {
        currentUser: null,
        commentThreads: [{
          id: 5,
          subjectType: 'ContentElement',
          subjectId: 10,
          subjectRange,
          comments: [{id: 1, body: 'A comment', creatorName: 'Alice', creatorId: 1}]
        }]
      }
    });

    expect(entry.container.querySelector(`.${highlightStyles.highlight}`))
      .not.toHaveClass(highlightStyles.selected);

    act(() => setSelectionRef({
      type: 'contentElementComments', id: 1, highlightedThreadId: 5
    }));

    expect(entry.container.querySelector(`.${highlightStyles.highlight}`))
      .toHaveClass(highlightStyles.selected);
  });
});
