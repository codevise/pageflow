import React from 'react';

import {features} from 'pageflow/frontend';
import {EditableText} from 'frontend';
import {renderEntry, useInlineEditingPageObjects} from 'support/pageObjects/inlineEditing';
import {fakeParentWindow} from 'support';

import {act} from '@testing-library/react';
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
    fakeParentWindow();
    window.parent.postMessage = jest.fn();

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

  it('runs badge click logic and scrolls into view on SELECT_COMMENT_THREAD message', async () => {
    fakeParentWindow();
    window.parent.postMessage = jest.fn();
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
});
