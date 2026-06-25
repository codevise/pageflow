import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {fireEvent} from '@testing-library/react';

import {EditableText} from 'frontend/commenting/EditableText';
import {commentHighlightStyles as highlightStyles} from 'pageflow-scrolled/review';
import {renderEntry, useCommentingPageObjects} from 'support/pageObjects/commenting';

describe('comment visibility', () => {
  useCommentingPageObjects();

  function renderEntryWithComments() {
    return renderEntry({
      seed: {contentElements: [{typeName: 'withTestId', configuration: {testId: 5}}]},
      commenting: {currentUser: {id: 42, name: 'Alice'}, commentThreads: []}
    });
  }

  it('collapses the toolbar to a show button when hidden', () => {
    const entry = renderEntryWithComments();

    fireEvent.click(entry.getHideCommentsButton());

    expect(entry.queryCommentToolbar()).toBeNull();
    expect(entry.getShowCommentsButton()).toBeInTheDocument();
  });

  it('drives the toggle through a view transition when supported', () => {
    const startViewTransition = jest.fn(run => {
      run();
      return {finished: Promise.resolve(), ready: Promise.resolve(), updateCallbackDone: Promise.resolve()};
    });
    document.startViewTransition = startViewTransition;

    try {
      const entry = renderEntryWithComments();

      fireEvent.click(entry.getHideCommentsButton());

      expect(startViewTransition).toHaveBeenCalledTimes(1);
      expect(entry.queryCommentToolbar()).toBeNull();
      expect(entry.getShowCommentsButton()).toBeInTheDocument();
    }
    finally {
      delete document.startViewTransition;
    }
  });

  it('restores the toolbar from the show button', () => {
    const entry = renderEntryWithComments();

    fireEvent.click(entry.getHideCommentsButton());
    fireEvent.click(entry.getShowCommentsButton());

    expect(entry.getCommentToolbar()).toBeInTheDocument();
    expect(entry.queryShowCommentsButton()).toBeNull();
  });

  it('hides comment badges while hidden and restores them when shown', () => {
    const entry = renderEntry({
      seed: {
        sections: [{id: 1, permaId: 10}],
        contentElements: [{typeName: 'withTestId', configuration: {testId: 5}}]
      },
      commenting: {
        currentUser: {id: 42, name: 'Alice'},
        commentThreads: [
          {id: 1, subjectType: 'ContentElement', subjectId: 1, comments: []},
          {id: 2, subjectType: 'Section', subjectId: 10, comments: []}
        ]
      }
    });

    expect(entry.queryAllCommentBadges().length).toBeGreaterThan(0);

    fireEvent.click(entry.getHideCommentsButton());
    expect(entry.queryAllCommentBadges()).toHaveLength(0);

    fireEvent.click(entry.getShowCommentsButton());
    expect(entry.queryAllCommentBadges().length).toBeGreaterThan(0);
  });

  it('hides inline comment highlights when hidden', () => {
    const value = [{type: 'paragraph', children: [{text: 'Some text to comment on'}]}];

    const entry = renderEntry({
      contentElement: {
        ui: <EditableText value={value} />,
        typeOptions: {inlineComments: true}
      },
      commenting: {
        currentUser: {id: 42, name: 'Alice'},
        commentThreads: [
          {id: 1, subjectType: 'ContentElement', subjectId: 10,
           subjectRange: {anchor: {path: [0, 0], offset: 5}, focus: {path: [0, 0], offset: 9}},
           comments: []}
        ]
      }
    });

    expect(document.querySelector(`.${highlightStyles.highlight}`)).toBeInTheDocument();

    fireEvent.click(entry.getHideCommentsButton());

    expect(document.querySelector(`.${highlightStyles.highlight}`)).toBeNull();
    expect(entry.getByText('Some text to comment on')).toBeInTheDocument();
  });

  it('leaves add comment mode when hidden', () => {
    const entry = renderEntryWithComments();

    fireEvent.click(entry.getAddCommentButton());
    expect(entry.getCancelAddCommentButton()).toBeInTheDocument();

    fireEvent.click(entry.getHideCommentsButton());
    fireEvent.click(entry.getShowCommentsButton());

    expect(entry.getAddCommentButton()).toBeInTheDocument();
  });
});
