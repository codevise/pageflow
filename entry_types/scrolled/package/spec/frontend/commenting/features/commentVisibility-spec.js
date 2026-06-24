import '@testing-library/jest-dom/extend-expect';
import {fireEvent} from '@testing-library/react';

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
});
