import '@testing-library/jest-dom/extend-expect';
import {fireEvent, within} from '@testing-library/react';

import {renderEntry, useCommentingPageObjects} from 'support/pageObjects/commenting';

describe('comment navigation', () => {
  useCommentingPageObjects();

  beforeEach(() => {
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
  });

  it('shows the number of navigable comments for the current filter', () => {
    const entry = renderEntryWithTwoThreads();

    expect(within(entry.getCommentToolbar()).getByTitle('2 comments')).toBeInTheDocument();
  });

  it('opens each thread popover when cycling forward', () => {
    const entry = renderEntryWithTwoThreads();

    const next = entry.getNextCommentButton();

    fireEvent.click(next);
    expect(entry.getByText('First comment')).toBeInTheDocument();

    fireEvent.click(next);
    expect(entry.getByText('Second comment')).toBeInTheDocument();
    expect(entry.queryByText('First comment')).not.toBeInTheDocument();
  });

  it('wraps to the last thread when cycling backward from the start', () => {
    const entry = renderEntryWithTwoThreads();

    fireEvent.click(entry.getPreviousCommentButton());

    expect(entry.getByText('Second comment')).toBeInTheDocument();
  });

  it('disables navigation when there are no comments for the filter', () => {
    const entry = renderEntry({
      seed: {contentElements: [{typeName: 'withTestId', configuration: {testId: 5}}]},
      commenting: {currentUser: {id: 42, name: 'Alice'}, commentThreads: []}
    });

    expect(entry.getNextCommentButton()).toBeDisabled();
    expect(entry.getPreviousCommentButton()).toBeDisabled();
  });

  it('skips resolved comments while navigating', () => {
    const entry = renderEntry({
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
          {id: 2, subjectType: 'ContentElement', subjectId: 2, resolvedAt: '2026-01-01',
           comments: [{id: 11, body: 'Resolved comment', creatorName: 'Bob', creatorId: 2}]},
          {id: 3, subjectType: 'ContentElement', subjectId: 3, resolvedAt: null,
           comments: [{id: 12, body: 'Third comment', creatorName: 'Bob', creatorId: 2}]}
        ]
      }
    });

    const next = entry.getNextCommentButton();

    fireEvent.click(next);
    expect(entry.getByText('First comment')).toBeInTheDocument();

    fireEvent.click(next);
    expect(entry.getByText('Third comment')).toBeInTheDocument();
    expect(entry.queryByText('Resolved comment')).not.toBeInTheDocument();
  });

  function renderEntryWithTwoThreads() {
    return renderEntry({
      seed: {
        contentElements: [
          {typeName: 'withTestId', configuration: {testId: 5}},
          {typeName: 'withTestId', configuration: {testId: 6}}
        ]
      },
      commenting: {
        currentUser: {id: 42, name: 'Alice'},
        commentThreads: [
          {id: 1, subjectType: 'ContentElement', subjectId: 1, resolvedAt: null,
           comments: [{id: 10, body: 'First comment', creatorName: 'Bob', creatorId: 2}]},
          {id: 2, subjectType: 'ContentElement', subjectId: 2, resolvedAt: null,
           comments: [{id: 11, body: 'Second comment', creatorName: 'Bob', creatorId: 2}]}
        ]
      }
    });
  }
});
