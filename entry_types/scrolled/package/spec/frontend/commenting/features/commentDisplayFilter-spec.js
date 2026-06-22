import '@testing-library/jest-dom/extend-expect';
import {fireEvent} from '@testing-library/react';

import {renderEntry, useCommentingPageObjects} from 'support/pageObjects/commenting';

describe('comment display filter', () => {
  useCommentingPageObjects();

  it('shows unresolved comments with the unresolved segment active by default', () => {
    const entry = renderEntryWithResolvedThread();

    expect(entry.queryAllCommentBadges()).toHaveLength(0);
    expect(entry.getCommentFilterButton('unresolved'))
      .toHaveAttribute('aria-pressed', 'true');
    expect(entry.getCommentFilterButton('all'))
      .toHaveAttribute('aria-pressed', 'false');
  });

  it('shows resolved comments when selecting all', () => {
    const entry = renderEntryWithResolvedThread();

    fireEvent.click(entry.getCommentFilterButton('all'));

    expect(entry.queryAllCommentBadges()).toHaveLength(1);
    expect(entry.getCommentFilterButton('all'))
      .toHaveAttribute('aria-pressed', 'true');
  });

  it('shows both resolved and unresolved comments when showing all', () => {
    const entry = renderEntry({
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
           comments: [{id: 10, body: 'Open', creatorName: 'Bob', creatorId: 2}]},
          {id: 2, subjectType: 'ContentElement', subjectId: 2, resolvedAt: '2026-01-01',
           comments: [{id: 11, body: 'Done', creatorName: 'Bob', creatorId: 2}]}
        ]
      }
    });

    expect(entry.queryAllCommentBadges()).toHaveLength(1);

    fireEvent.click(entry.getCommentFilterButton('all'));

    expect(entry.queryAllCommentBadges()).toHaveLength(2);
  });

  it('hides resolved comments again when selecting unresolved', () => {
    const entry = renderEntryWithResolvedThread();

    fireEvent.click(entry.getCommentFilterButton('all'));
    expect(entry.queryAllCommentBadges()).toHaveLength(1);

    fireEvent.click(entry.getCommentFilterButton('unresolved'));

    expect(entry.queryAllCommentBadges()).toHaveLength(0);
  });

  function renderEntryWithResolvedThread() {
    return renderEntry({
      seed: {
        contentElements: [{typeName: 'withTestId', configuration: {testId: 5}}]
      },
      commenting: {
        currentUser: {id: 42, name: 'Alice'},
        commentThreads: [
          {id: 1, subjectType: 'ContentElement', subjectId: 1, resolvedAt: '2026-01-01',
           comments: [{id: 10, body: 'Done', creatorName: 'Bob', creatorId: 2}]}
        ]
      }
    });
  }
});
