import React from 'react';

import {features} from 'pageflow/frontend';
import {EditableText} from 'frontend';
import {renderEntry, useInlineEditingPageObjects} from 'support/pageObjects/inlineEditing';

import {act, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import {commentHighlightStyles as highlightStyles} from 'pageflow-scrolled/review';

describe('inline editing EditableText comment highlights', () => {
  useInlineEditingPageObjects();

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

  it('highlights pending new thread range from editor state', async () => {
    const entry = renderEntry({
      contentElement: {
        ui: <EditableText value={value} />,
        typeOptions: {inlineComments: true}
      }
    });

    expect(entry.container.querySelector(`.${highlightStyles.highlight}`))
      .not.toBeInTheDocument();

    act(() => {
      window.postMessage({
        type: 'SELECT',
        payload: {
          type: 'newThread',
          subjectType: 'ContentElement',
          subjectId: 10,
          range: subjectRange
        }
      }, '*');
    });

    await waitFor(() => {
      expect(entry.container.querySelector(`.${highlightStyles.highlight}`))
        .toBeInTheDocument();
    });

    const highlight = entry.container.querySelector(`.${highlightStyles.highlight}`);
    expect(highlight).toHaveTextContent('text');
    expect(highlight).toHaveClass(highlightStyles.selected);
  });

  it('hides resolved thread highlights until the thread is selected', async () => {
    const entry = renderEntry({
      contentElement: {
        ui: <EditableText value={value} />,
        typeOptions: {inlineComments: true, customSelectionRect: true}
      },
      commenting: {
        currentUser: null,
        commentThreads: [{
          id: 7,
          subjectType: 'ContentElement',
          subjectId: 10,
          subjectRange,
          resolvedAt: '2026-06-01T00:00:00Z',
          comments: [{id: 1, body: 'A comment', creatorName: 'Alice', creatorId: 1}]
        }]
      }
    });

    expect(entry.container.querySelector(`.${highlightStyles.highlight}`))
      .not.toBeInTheDocument();

    act(() => {
      window.postMessage({
        type: 'SELECT_COMMENT_THREAD',
        payload: {threadId: 7}
      }, '*');
    });

    await waitFor(() => {
      expect(entry.container.querySelector(`.${highlightStyles.highlight}`))
        .toBeInTheDocument();
    });

    const highlight = entry.container.querySelector(`.${highlightStyles.highlight}`);
    expect(highlight).toHaveClass(highlightStyles.resolved);
    expect(highlight).not.toHaveClass(highlightStyles.selected);
  });

  it('keeps the resolved thread highlighted when a cursor sits in another block', () => {
    const multiBlockValue = [
      {type: 'paragraph', children: [{text: 'First paragraph'}]},
      {type: 'paragraph', children: [{text: 'Second paragraph'}]}
    ];

    const entry = renderEntry({
      contentElement: {
        ui: <EditableText value={multiBlockValue} contentElementId={1} selectionRect={true} />,
        typeOptions: {inlineComments: true, customSelectionRect: true}
      },
      commenting: {
        currentUser: null,
        commentThreads: [{
          id: 7,
          subjectType: 'ContentElement',
          subjectId: 10,
          subjectRange: {anchor: {path: [1, 0], offset: 0}, focus: {path: [1, 0], offset: 6}},
          resolvedAt: '2026-06-01T00:00:00Z',
          comments: [{id: 1, body: 'A comment', creatorName: 'Alice', creatorId: 1}]
        }]
      }
    });

    // The reviewer had clicked into the first paragraph, leaving a slate
    // cursor there before opening the resolved comment from the sidebar.
    act(() => {
      window.dispatchEvent(new MessageEvent('message', {
        data: {type: 'SELECT', payload: {type: 'contentElement', id: 1, range: [0, 1]}},
        origin: window.location.origin
      }));
    });

    act(() => {
      window.dispatchEvent(new MessageEvent('message', {
        data: {type: 'SELECT_COMMENT_THREAD', payload: {threadId: 7}},
        origin: window.location.origin
      }));
    });

    const highlight = entry.container.querySelector(`.${highlightStyles.highlight}`);
    expect(highlight).toBeInTheDocument();
    expect(highlight).toHaveTextContent('Second');
    expect(highlight).toHaveClass(highlightStyles.resolved);
    expect(highlight).not.toHaveClass(highlightStyles.selected);
  });

  it('applies selected style to highlight when thread badge is clicked', () => {
    const entry = renderEntry({
      contentElement: {
        ui: <EditableText value={value} />,
        typeOptions: {inlineComments: true, customSelectionRect: true}
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

    entry.queryAllCommentBadges()[0].select();

    expect(entry.container.querySelector(`.${highlightStyles.highlight}`))
      .toHaveClass(highlightStyles.selected);
  });
});
