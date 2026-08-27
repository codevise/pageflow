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

  describe('while comments show only for the selection', () => {
    function renderEntryWithThread() {
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
            comments: [{id: 1, body: 'A comment', creatorName: 'Alice', creatorId: 1}]
          }]
        }
      });

      act(() => {
        window.postMessage({
          type: 'CHANGE_COMMENT_DISPLAY_FILTER',
          payload: {resolution: 'unresolved', alwaysShowComments: false}
        }, '*');
      });

      return entry;
    }

    it('leaves commented text unmarked', async () => {
      const entry = renderEntryWithThread();

      await waitFor(() => {
        expect(entry.container.querySelector(`.${highlightStyles.highlight}`))
          .not.toBeInTheDocument();
      });
    });

    // The selection rect the editable text draws spans the blocks the
    // cursor covers, which is what reads as the selection.
    it('marks commented text of the blocks within the selection rect', async () => {
      const entry = renderEntryWithThreadPerParagraph();

      act(() => {
        window.postMessage({
          type: 'SELECT',
          payload: {type: 'contentElement', id: 1, range: [0, 1]}
        }, '*');
      });

      await waitFor(() => {
        expect(highlightTexts(entry)).toEqual(['First']);
      });
    });

    // Moving the cursor re-renders neither the editable text nor its
    // `renderLeaf`, so the marks can only follow along because the spans
    // read the cursor from the slate context themselves.
    it('follows the selection into another block', async () => {
      const entry = renderEntryWithThreadPerParagraph();

      act(() => {
        window.postMessage({
          type: 'SELECT',
          payload: {type: 'contentElement', id: 1, range: [0, 1]}
        }, '*');
      });

      await waitFor(() => {
        expect(highlightTexts(entry)).toEqual(['First']);
      });

      act(() => {
        window.postMessage({
          type: 'SELECT',
          payload: {type: 'contentElement', id: 1, range: [1, 2]}
        }, '*');
      });

      await waitFor(() => {
        expect(highlightTexts(entry)).toEqual(['Second']);
      });
    });

    // Following a comment from the sidebar leaves focus outside the
    // editor, so the picked thread's block stands in for the cursor —
    // the badge column measures against the same point.
    it('marks the comments sharing a block with a thread picked from the sidebar', async () => {
      const entry = renderEntryWithThreadPerParagraph({
        commentThreads: [
          {id: 7, subjectType: 'ContentElement', subjectId: 10,
           subjectRange: {anchor: {path: [0, 0], offset: 0},
                          focus: {path: [0, 0], offset: 5}},
           comments: [{id: 10, body: 'Picked', creatorName: 'Alice', creatorId: 1}]},
          {id: 8, subjectType: 'ContentElement', subjectId: 10,
           subjectRange: {anchor: {path: [0, 0], offset: 6},
                          focus: {path: [0, 0], offset: 15}},
           comments: [{id: 20, body: 'Sibling', creatorName: 'Bob', creatorId: 2}]},
          {id: 9, subjectType: 'ContentElement', subjectId: 10,
           subjectRange: {anchor: {path: [1, 0], offset: 0},
                          focus: {path: [1, 0], offset: 6}},
           comments: [{id: 30, body: 'Elsewhere', creatorName: 'Bob', creatorId: 2}]}
        ]
      });

      act(() => {
        window.postMessage({
          type: 'SELECT_COMMENT_THREAD',
          payload: {threadId: 7}
        }, '*');
      });

      await waitFor(() => {
        expect(highlightTexts(entry)).toEqual(['First', 'paragraph']);
      });
    });

    function renderEntryWithThreadPerParagraph({commentThreads} = {}) {
      const entry = renderEntry({
        contentElement: {
          ui: <EditableText value={[
            {type: 'paragraph', children: [{text: 'First paragraph'}]},
            {type: 'paragraph', children: [{text: 'Second paragraph'}]}
          ]} contentElementId={1} selectionRect={true} />,
          typeOptions: {inlineComments: true, customSelectionRect: true}
        },
        commenting: {
          currentUser: null,
          commentThreads: commentThreads || [
            {id: 1, subjectType: 'ContentElement', subjectId: 10,
             subjectRange: {anchor: {path: [0, 0], offset: 0},
                            focus: {path: [0, 0], offset: 5}},
             comments: [{id: 10, body: 'On the first', creatorName: 'Alice', creatorId: 1}]},
            {id: 2, subjectType: 'ContentElement', subjectId: 10,
             subjectRange: {anchor: {path: [1, 0], offset: 0},
                            focus: {path: [1, 0], offset: 6}},
             comments: [{id: 20, body: 'On the second', creatorName: 'Bob', creatorId: 2}]}
          ]
        }
      });

      act(() => {
        window.postMessage({
          type: 'CHANGE_COMMENT_DISPLAY_FILTER',
          payload: {resolution: 'unresolved', alwaysShowComments: false}
        }, '*');
      });

      return entry;
    }

    function highlightTexts(entry) {
      return [...entry.container.querySelectorAll(`.${highlightStyles.highlight}`)]
        .map(element => element.textContent);
    }

    // Opening a comment in the sidebar has to keep pointing at the text it
    // refers to.
    it('marks the text of a thread selected from the sidebar', async () => {
      const entry = renderEntryWithThread();

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
    });
  });

  it('highlights a resolved thread while the editor shows all resolutions', async () => {
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

    act(() => {
      window.postMessage({
        type: 'CHANGE_COMMENT_DISPLAY_FILTER',
        payload: {resolution: 'all'}
      }, '*');
    });

    await waitFor(() => {
      expect(entry.container.querySelector(`.${highlightStyles.highlight}`))
        .toBeInTheDocument();
    });

    expect(entry.container.querySelector(`.${highlightStyles.highlight}`))
      .toHaveClass(highlightStyles.resolved);
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
