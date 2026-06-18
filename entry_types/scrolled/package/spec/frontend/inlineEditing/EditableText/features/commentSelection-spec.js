import React from 'react';

import {features} from 'pageflow/frontend';
import {EditableText} from 'frontend';
import {useStartNewThread} from 'frontend/inlineEditing/EditableText/useStartNewThread';
import {renderEntry, useInlineEditingPageObjects} from 'support/pageObjects/inlineEditing';

import {act, fireEvent, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

describe('inline editing EditableText comment selection messages', () => {
  useInlineEditingPageObjects();

  beforeEach(() => {
    jest.spyOn(features, 'isEnabled').mockImplementation(
      name => name === 'commenting'
    );
  });

  afterEach(() => {
    features.isEnabled.mockRestore();
  });

  it('posts SELECTED contentElementComments with highlightedThreadId on badge click', () => {

    const value = [
      {type: 'paragraph', children: [{text: 'First paragraph'}]}
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
           comments: [{id: 1, body: 'a', creatorName: 'Alice', creatorId: 1}]}
        ]
      }
    });

    entry.queryAllCommentBadges()[0].select();

    expect(window.parent.postMessage).toHaveBeenCalledWith({
      type: 'SELECTED',
      payload: {
        type: 'contentElementComments',
        id: 1,
        highlightedThreadId: 5
      }
    }, expect.anything());
  });

  it('posts SELECTED newThread with subject and range when starting a thread on a text range', () => {
    const range = {anchor: {path: [0, 0], offset: 0}, focus: {path: [0, 0], offset: 5}};

    function StartNewThreadButton() {
      const startNewThread = useStartNewThread({selection: range});
      return <button onClick={startNewThread}>Start thread</button>;
    }

    const {getByText} = renderEntry({
      contentElement: {
        ui: <StartNewThreadButton />,
        typeOptions: {inlineComments: true}
      }
    });

    fireEvent.click(getByText('Start thread'));

    expect(window.parent.postMessage).toHaveBeenCalledWith({
      type: 'SELECTED',
      payload: {
        type: 'newThread',
        subjectType: 'ContentElement',
        subjectId: 10,
        range
      }
    }, expect.anything());
  });

  it('runs badge click logic and scrolls into view on SELECT_COMMENT_THREAD message', async () => {
    const scrollIntoView = jest.fn();
    Element.prototype.scrollIntoView = scrollIntoView;

    const subjectRange = {anchor: {path: [0, 0], offset: 0}, focus: {path: [0, 0], offset: 5}};
    const value = [{type: 'paragraph', children: [{text: 'Some text to comment on'}]}];

    renderEntry({
      contentElement: {
        ui: <EditableText value={value} />,
        typeOptions: {inlineComments: true, customSelectionRect: true}
      },
      commenting: {
        currentUser: null,
        commentThreads: [{
          id: 9,
          subjectType: 'ContentElement',
          subjectId: 10,
          subjectRange,
          comments: [{id: 1, body: 'A comment', creatorName: 'Alice', creatorId: 1}]
        }]
      }
    });

    window.parent.postMessage.mockClear();

    const echoed = new Promise(resolve => {
      const original = window.parent.postMessage;
      window.parent.postMessage = (data, ...rest) => {
        original(data, ...rest);
        if (data.type === 'SELECTED' && data.payload.type === 'contentElementComments') {
          resolve(data);
        }
      };
    });

    act(() => {
      window.postMessage({
        type: 'SELECT_COMMENT_THREAD',
        payload: {threadId: 9}
      }, '*');
    });

    await expect(echoed).resolves.toMatchObject({
      type: 'SELECTED',
      payload: {type: 'contentElementComments', id: 1, highlightedThreadId: 9}
    });

    expect(scrollIntoView).toHaveBeenCalled();
    delete Element.prototype.scrollIntoView;
  });

  it('includes resolved thread ids at the selection in transient state', async () => {
    const value = [{type: 'paragraph', children: [{text: 'Some text to comment on'}]}];

    renderEntry({
      contentElement: {
        ui: <EditableText value={value} contentElementId={1} selectionRect={true} />,
        typeOptions: {inlineComments: true, customSelectionRect: true}
      },
      commenting: {
        currentUser: null,
        commentThreads: [
          {id: 1, subjectType: 'ContentElement', subjectId: 10,
           subjectRange: {anchor: {path: [0, 0], offset: 0}, focus: {path: [0, 0], offset: 4}},
           comments: [{id: 10, body: 'Active', creatorName: 'Alice', creatorId: 1}]},
          {id: 7, subjectType: 'ContentElement', subjectId: 10,
           subjectRange: {anchor: {path: [0, 0], offset: 5}, focus: {path: [0, 0], offset: 9}},
           resolvedAt: '2026-06-01T00:00:00Z',
           comments: [{id: 20, body: 'Resolved', creatorName: 'Bob', creatorId: 2}]}
        ]
      }
    });

    act(() => {
      window.dispatchEvent(new MessageEvent('message', {
        data: {type: 'SELECT', payload: {type: 'contentElement', id: 1, range: [0, 1]}},
        origin: window.location.origin
      }));
    });

    await waitFor(() => {
      expect(window.parent.postMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'UPDATE_TRANSIENT_CONTENT_ELEMENT_STATE',
          payload: expect.objectContaining({
            id: 1,
            state: expect.objectContaining({
              commentThreadIdsAtSelection: expect.arrayContaining([1, 7])
            })
          })
        }),
        expect.anything()
      );
    });
  });

  it('scrolls a resolved thread into view when selected via SELECT_COMMENT_THREAD', () => {
    const scrollIntoView = jest.fn();
    Element.prototype.scrollIntoView = scrollIntoView;

    const subjectRange = {anchor: {path: [0, 0], offset: 0}, focus: {path: [0, 0], offset: 5}};
    const value = [{type: 'paragraph', children: [{text: 'Some text to comment on'}]}];

    renderEntry({
      contentElement: {
        ui: <EditableText value={value} />,
        typeOptions: {inlineComments: true, customSelectionRect: true}
      },
      commenting: {
        currentUser: null,
        commentThreads: [{
          id: 9,
          subjectType: 'ContentElement',
          subjectId: 10,
          subjectRange,
          resolvedAt: '2026-06-01T00:00:00Z',
          comments: [{id: 1, body: 'A comment', creatorName: 'Alice', creatorId: 1}]
        }]
      }
    });

    act(() => {
      window.dispatchEvent(new MessageEvent('message', {
        data: {type: 'SELECT_COMMENT_THREAD', payload: {threadId: 9}},
        origin: window.location.origin
      }));
    });

    expect(scrollIntoView).toHaveBeenCalled();
    delete Element.prototype.scrollIntoView;
  });
});
