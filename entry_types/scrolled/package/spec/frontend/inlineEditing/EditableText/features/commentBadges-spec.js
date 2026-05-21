import React from 'react';

import {features} from 'pageflow/frontend';
import {EditableText} from 'frontend';
import {renderEntry, useInlineEditingPageObjects} from 'support/pageObjects/inlineEditing';

import '@testing-library/jest-dom/extend-expect';

describe('inline editing EditableText comment badges', () => {
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
