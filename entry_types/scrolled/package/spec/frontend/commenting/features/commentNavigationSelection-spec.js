import '@testing-library/jest-dom/extend-expect';
import {fireEvent} from '@testing-library/react';

import {renderEntry, useCommentingPageObjects} from 'support/pageObjects/commenting';
import styles from 'frontend/commenting/FloatingToolbar.module.css';

describe('comment navigation coupled with selection', () => {
  useCommentingPageObjects();

  beforeEach(() => {
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
  });

  it('moves the position indicator to the clicked subject', () => {
    const entry = renderEntryWithThreeThreads();

    fireEvent.click(entry.getAllCommentBadges()[1]);

    const toolbar = entry.getCommentToolbar();

    expect(toolbar.querySelector(`.${styles.count}`)).toHaveTextContent(/^2\s*\//);
  });

  it('continues navigation forward from the clicked subject', () => {
    const entry = renderEntryWithThreeThreads();

    fireEvent.click(entry.getAllCommentBadges()[1]);
    expect(entry.getByText('Second comment')).toBeInTheDocument();

    fireEvent.click(entry.getNextCommentButton());

    expect(entry.getByText('Third comment')).toBeInTheDocument();
    expect(entry.queryByText('Second comment')).not.toBeInTheDocument();
  });

  it('continues navigation backward from the clicked subject', () => {
    const entry = renderEntryWithThreeThreads();

    fireEvent.click(entry.getAllCommentBadges()[1]);
    expect(entry.getByText('Second comment')).toBeInTheDocument();

    fireEvent.click(entry.getPreviousCommentButton());

    expect(entry.getByText('First comment')).toBeInTheDocument();
    expect(entry.queryByText('Second comment')).not.toBeInTheDocument();
  });

  function renderEntryWithThreeThreads() {
    return renderEntry({
      seed: {
        contentElements: [
          {typeName: 'withTestId', configuration: {testId: 5}},
          {typeName: 'withTestId', configuration: {testId: 6}},
          {typeName: 'withTestId', configuration: {testId: 7}}
        ]
      },
      commenting: {
        currentUser: {id: 42, name: 'Alice'},
        commentThreads: [
          {id: 1, subjectType: 'ContentElement', subjectId: 1, resolvedAt: null,
           comments: [{id: 10, body: 'First comment', creatorName: 'Bob', creatorId: 2}]},
          {id: 2, subjectType: 'ContentElement', subjectId: 2, resolvedAt: null,
           comments: [{id: 11, body: 'Second comment', creatorName: 'Bob', creatorId: 2}]},
          {id: 3, subjectType: 'ContentElement', subjectId: 3, resolvedAt: null,
           comments: [{id: 12, body: 'Third comment', creatorName: 'Bob', creatorId: 2}]}
        ]
      }
    });
  }
});
