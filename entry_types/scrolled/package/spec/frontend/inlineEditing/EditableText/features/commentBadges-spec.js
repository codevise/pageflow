import React from 'react';

import {features} from 'pageflow/frontend';
import {EditableText} from 'frontend';
import {renderEntry, useInlineEditingPageObjects} from 'support/pageObjects/inlineEditing';

import {act, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

describe('inline editing EditableText comment badges', () => {
  useInlineEditingPageObjects();

  beforeEach(() => {
    jest.spyOn(features, 'isEnabled').mockImplementation(
      name => name === 'commenting'
    );
  });

  afterEach(() => {
    features.isEnabled.mockRestore();
  });

  it('renders badge in dot mode by default', () => {
    const value = [{type: 'paragraph', children: [{text: 'Some text to comment on'}]}];

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
          subjectRange: {anchor: {path: [0, 0], offset: 5}, focus: {path: [0, 0], offset: 9}},
          comments: [{id: 1, body: 'A comment', creatorName: 'Alice', creatorId: 1}]
        }]
      }
    });

    const badges = entry.queryAllCommentBadges();
    expect(badges).toHaveLength(1);
    expect(badges[0].isInDotMode()).toBe(true);
  });

  function renderEntryWithUnreadThread() {
    const value = [{type: 'paragraph', children: [{text: 'Some text to comment on'}]}];

    return renderEntry({
      contentElement: {
        ui: <EditableText value={value} />,
        typeOptions: {inlineComments: true, customSelectionRect: true}
      },
      commenting: {
        currentUser: {id: 42, name: 'Alice'},
        commentThreads: [{
          id: 5,
          permaId: 5,
          subjectType: 'ContentElement',
          subjectId: 10,
          subjectRange: {anchor: {path: [0, 0], offset: 5}, focus: {path: [0, 0], offset: 9}},
          comments: [{
            id: 1, body: 'A comment', creatorName: 'Bob', creatorId: 43,
            createdAt: '2026-08-17T11:00:00.000Z'
          }]
        }],
        commentThreadReads: {}
      }
    });
  }

  it('marks a badge whose thread has unseen comments', () => {
    const entry = renderEntryWithUnreadThread();

    expect(entry.queryAllCommentBadges()[0].isUnread()).toBe(true);
  });

  it('keeps a badge with unseen comments out of dot mode', () => {
    const entry = renderEntryWithUnreadThread();

    expect(entry.queryAllCommentBadges()[0].isInDotMode()).toBe(false);
  });

  it('renders only the highlighted thread badge in active mode', () => {
    const value = [
      {type: 'paragraph', children: [{text: 'First paragraph thread here'}]},
      {type: 'paragraph', children: [{text: 'Second paragraph thread here'}]}
    ];

    const entry = renderEntry({
      contentElement: {
        ui: <EditableText value={value} />,
        typeOptions: {inlineComments: true, customSelectionRect: true}
      },
      commenting: {
        currentUser: null,
        commentThreads: [
          {id: 5, subjectType: 'ContentElement', subjectId: 10,
           subjectRange: {anchor: {path: [0, 0], offset: 0}, focus: {path: [0, 0], offset: 5}},
           comments: [{id: 1, body: 'first', creatorName: 'Alice', creatorId: 1}]},
          {id: 7, subjectType: 'ContentElement', subjectId: 10,
           subjectRange: {anchor: {path: [1, 0], offset: 0}, focus: {path: [1, 0], offset: 6}},
           comments: [{id: 2, body: 'second', creatorName: 'Bob', creatorId: 2}]}
        ]
      }
    });

    entry.queryAllCommentBadges()[0].select();

    const badges = entry.queryAllCommentBadges();
    expect(badges).toHaveLength(2);
    expect(badges[0].isActive()).toBe(true);
    expect(badges[1].isActive()).toBe(false);
  });

  it('renders a revealed resolved thread badge in resolved style', async () => {
    const value = [{type: 'paragraph', children: [{text: 'Some text to comment on'}]}];

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
          subjectRange: {anchor: {path: [0, 0], offset: 5}, focus: {path: [0, 0], offset: 9}},
          resolvedAt: '2026-06-01T00:00:00Z',
          comments: [{id: 1, body: 'A comment', creatorName: 'Alice', creatorId: 1}]
        }]
      }
    });

    expect(entry.queryAllCommentBadges()).toHaveLength(0);

    act(() => {
      window.dispatchEvent(new MessageEvent('message', {
        data: {type: 'SELECT_COMMENT_THREAD', payload: {threadId: 7}},
        origin: window.location.origin
      }));
    });

    await waitFor(() => {
      expect(entry.queryAllCommentBadges()).toHaveLength(1);
    });

    const badge = entry.queryAllCommentBadges()[0];
    expect(badge.isResolved()).toBe(true);
    expect(badge.isActive()).toBe(true);
  });

  it('hides the badge of a thread while comments show only for the selection', async () => {
    const value = [{type: 'paragraph', children: [{text: 'Some text to comment on'}]}];

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
          subjectRange: {anchor: {path: [0, 0], offset: 5}, focus: {path: [0, 0], offset: 9}},
          comments: [{id: 1, body: 'A comment', creatorName: 'Alice', creatorId: 1}]
        }]
      }
    });

    expect(entry.queryAllCommentBadges()).toHaveLength(1);

    act(() => {
      window.dispatchEvent(new MessageEvent('message', {
        data: {
          type: 'CHANGE_COMMENT_DISPLAY_FILTER',
          payload: {resolution: 'unresolved', alwaysShowComments: false}
        },
        origin: window.location.origin
      }));
    });

    await waitFor(() => {
      expect(entry.queryAllCommentBadges()).toHaveLength(0);
    });
  });

  it('shows the badge within the selection rect once the text is selected', async () => {
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
        commentThreads: [
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
      window.dispatchEvent(new MessageEvent('message', {
        data: {
          type: 'CHANGE_COMMENT_DISPLAY_FILTER',
          payload: {resolution: 'unresolved', alwaysShowComments: false}
        },
        origin: window.location.origin
      }));
    });

    await waitFor(() => {
      expect(entry.queryAllCommentBadges()).toHaveLength(0);
    });

    act(() => {
      window.dispatchEvent(new MessageEvent('message', {
        data: {type: 'SELECT', payload: {type: 'contentElement', id: 1, range: [0, 1]}},
        origin: window.location.origin
      }));
    });

    await waitFor(() => {
      expect(entry.queryAllCommentBadges()).toHaveLength(1);
    });

    expect(entry.queryAllCommentBadges()[0].isInDotMode()).toBe(false);
  });

  it('renders the badge of a resolved thread while the editor shows all resolutions', async () => {
    const value = [{type: 'paragraph', children: [{text: 'Some text to comment on'}]}];

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
          subjectRange: {anchor: {path: [0, 0], offset: 5}, focus: {path: [0, 0], offset: 9}},
          resolvedAt: '2026-06-01T00:00:00Z',
          comments: [{id: 1, body: 'A comment', creatorName: 'Alice', creatorId: 1}]
        }]
      }
    });

    expect(entry.queryAllCommentBadges()).toHaveLength(0);

    act(() => {
      window.dispatchEvent(new MessageEvent('message', {
        data: {
          type: 'CHANGE_COMMENT_DISPLAY_FILTER',
          payload: {resolution: 'all'}
        },
        origin: window.location.origin
      }));
    });

    await waitFor(() => {
      expect(entry.queryAllCommentBadges()).toHaveLength(1);
    });

    const badge = entry.queryAllCommentBadges()[0];
    expect(badge.isResolved()).toBe(true);
    expect(badge.isActive()).toBe(false);
  });

  it('keeps the badge of an overlapped thread after a resolved thread is revealed', async () => {
    const value = [{type: 'paragraph', children: [{text: 'Alpha beta gamma delta'}]}];

    function range(start, end) {
      return {anchor: {path: [0, 0], offset: start}, focus: {path: [0, 0], offset: end}};
    }

    function selectThread(threadId) {
      act(() => {
        window.dispatchEvent(new MessageEvent('message', {
          data: {type: 'SELECT_COMMENT_THREAD', payload: {threadId}},
          origin: window.location.origin
        }));
      });
    }

    const entry = renderEntry({
      contentElement: {
        ui: <EditableText value={value} />,
        typeOptions: {inlineComments: true, customSelectionRect: true}
      },
      commenting: {
        currentUser: null,
        commentThreads: [
          {id: 5, subjectType: 'ContentElement', subjectId: 10, subjectRange: range(0, 5),
           comments: [{id: 1, body: 'a', creatorName: 'Alice', creatorId: 1}]},
          {id: 6, subjectType: 'ContentElement', subjectId: 10, subjectRange: range(6, 16),
           comments: [{id: 2, body: 'b', creatorName: 'Bob', creatorId: 2}]},
          {id: 7, subjectType: 'ContentElement', subjectId: 10, subjectRange: range(17, 22),
           comments: [{id: 3, body: 'c', creatorName: 'Carol', creatorId: 3}]},
          {id: 8, subjectType: 'ContentElement', subjectId: 10, subjectRange: range(8, 12),
           resolvedAt: '2026-06-01T00:00:00Z',
           comments: [{id: 4, body: 'r', creatorName: 'Dave', creatorId: 4}]}
        ]
      }
    });

    expect(entry.queryAllCommentBadges()).toHaveLength(3);

    selectThread(8);
    await waitFor(() => expect(entry.queryAllCommentBadges()).toHaveLength(4));

    selectThread(5);
    await waitFor(() => expect(entry.queryAllCommentBadges()[0].isActive()).toBe(true));

    expect(entry.queryAllCommentBadges()).toHaveLength(3);
  });

  it('renders sibling badge in regular mode when in same block as highlighted thread', () => {
    const value = [
      {type: 'paragraph', children: [{text: 'First paragraph with two threads'}]},
      {type: 'paragraph', children: [{text: 'Second paragraph thread'}]}
    ];

    const entry = renderEntry({
      contentElement: {
        ui: <EditableText value={value} />,
        typeOptions: {inlineComments: true, customSelectionRect: true}
      },
      commenting: {
        currentUser: null,
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
    });

    entry.queryAllCommentBadges()[0].select();

    const badges = entry.queryAllCommentBadges();
    expect(badges).toHaveLength(3);
    expect(badges[0].isActive()).toBe(true);
    expect(badges[1].isInDotMode()).toBe(false);
    expect(badges[2].isInDotMode()).toBe(true);
  });
});
