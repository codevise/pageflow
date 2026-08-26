import '@testing-library/jest-dom/extend-expect';
import {fireEvent} from '@testing-library/react';

import {renderEntry, useCommentingPageObjects} from 'support/pageObjects/commenting';
import activityStyles from 'frontend/commenting/ActivityButton.module.css';
import badgeStyles from 'review/Badge.module.css';

describe('comment activity', () => {
  useCommentingPageObjects();

  beforeEach(() => {
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
  });

  const currentUser = {id: 42, name: 'Alice'};

  function renderEntryWithThreads(commentThreads) {
    return renderEntry({
      seed: {
        contentElements: [
          {typeName: 'withTestId', configuration: {testId: 5}},
          {typeName: 'withTestId', configuration: {testId: 6}}
        ]
      },
      commenting: {currentUser, commentThreads}
    });
  }

  function renderEntryWithTwoThreads() {
    return renderEntryWithThreads([
      {id: 1, permaId: 5, subjectType: 'ContentElement', subjectId: 1,
       comments: [{id: 10, body: 'First topic', creatorName: 'Bob', creatorId: 2,
                   createdAt: '2026-08-17T09:00:00.000Z'}]},
      {id: 2, permaId: 6, subjectType: 'ContentElement', subjectId: 2,
       comments: [{id: 11, body: 'Second topic', creatorName: 'Bob', creatorId: 2,
                   createdAt: '2026-08-17T11:00:00.000Z'}]}
    ]);
  }

  it('opens the feed from the toolbar', () => {
    const entry = renderEntryWithTwoThreads();

    expect(entry.queryActivityPanel()).toBeNull();

    fireEvent.click(entry.getActivityButton());

    expect(entry.getActivityPanel()).toBeInTheDocument();
  });

  it('renders the feed above the navigation widgets', () => {
    const entry = renderEntryWithTwoThreads();

    fireEvent.click(entry.getActivityButton());

    expect(document.getElementById('floating-ui-above-navigation-widgets'))
      .toContainElement(entry.getActivityPanel());
  });

  it('lists the activity of every subject newest first', () => {
    const entry = renderEntryWithTwoThreads();

    fireEvent.click(entry.getActivityButton());

    const panel = entry.getActivityPanel();

    expect(panel).toHaveTextContent('First topic');
    expect(panel).toHaveTextContent('Second topic');
  });

  it('closes an open thread popover when the feed opens', () => {
    const entry = renderEntryWithTwoThreads();

    fireEvent.click(entry.getAllCommentBadges()[0]);
    expect(entry.getAllByText('First topic')).toHaveLength(1);

    fireEvent.click(entry.getActivityButton());

    expect(entry.getAllByText('First topic')).toHaveLength(1);
    expect(entry.getActivityPanel()).toHaveTextContent('First topic');
  });

  it('closes the feed again from the toolbar', () => {
    const entry = renderEntryWithTwoThreads();

    fireEvent.click(entry.getActivityButton());
    fireEvent.click(entry.getActivityButton());

    expect(entry.queryActivityPanel()).toBeNull();
  });

  it('closes the feed on a click outside', () => {
    const entry = renderEntryWithTwoThreads();

    fireEvent.click(entry.getActivityButton());
    fireEvent.mouseDown(document.body);

    expect(entry.queryActivityPanel()).toBeNull();
  });

  it('keeps the feed open while it is being used', () => {
    const entry = renderEntryWithTwoThreads();

    fireEvent.click(entry.getActivityButton());
    fireEvent.mouseDown(entry.getActivityPanel());

    expect(entry.getActivityPanel()).toBeInTheDocument();
  });

  it('closes the feed on escape', () => {
    const entry = renderEntryWithTwoThreads();

    fireEvent.click(entry.getActivityButton());
    fireEvent.keyDown(document, {key: 'Escape'});

    expect(entry.queryActivityPanel()).toBeNull();
  });

  it('reveals the subject of a clicked entry without leaving the feed', () => {
    const entry = renderEntryWithTwoThreads();

    fireEvent.click(entry.getActivityButton());
    fireEvent.click(entry.getByText('First topic'));

    expect(entry.getActivityPanel()).toBeInTheDocument();
    expect(window.HTMLElement.prototype.scrollIntoView).toHaveBeenCalled();
  });

  // The row shows the thread already, so a popover would only say it
  // twice and cover the content just revealed.
  it('opens no popover for a clicked entry', () => {
    const entry = renderEntryWithTwoThreads();

    fireEvent.click(entry.getActivityButton());
    fireEvent.click(entry.getByText('First topic'));

    expect(entry.getAllByText('First topic')).toHaveLength(1);
  });

  it('opens the popover from the badge of a revealed subject', () => {
    const entry = renderEntryWithTwoThreads();

    fireEvent.click(entry.getActivityButton());
    fireEvent.click(entry.getByText('First topic'));

    fireEvent.click(entry.getAllCommentBadges()[0]);

    expect(entry.getAllByText('First topic')).toHaveLength(2);
  });

  it('reveals a resolved thread without turning all of them on', () => {
    const entry = renderEntryWithThreads([
      {id: 1, permaId: 5, subjectType: 'ContentElement', subjectId: 1,
       resolvedAt: '2026-08-17T12:00:00.000Z', resolvedById: 2, resolverName: 'Bob',
       comments: [{id: 10, body: 'Resolved topic', creatorName: 'Bob', creatorId: 2,
                   createdAt: '2026-08-17T09:00:00.000Z'}]}
    ]);

    fireEvent.click(entry.getActivityButton());
    fireEvent.click(entry.getByText('Resolved topic'));

    expect(entry.getCommentFilterButton('unresolved'))
      .toHaveAttribute('aria-pressed', 'true');
    expect(entry.getByText('Resolved topic')).toBeInTheDocument();
    expect(entry.getAllCommentBadges()[0]).toHaveClass(badgeStyles.resolved);
  });

  it('marks the button while activity is unseen', () => {
    const entry = renderEntryWithTwoThreads();

    expect(entry.getActivityButton().querySelector(`.${activityStyles.unseenDot}`))
      .not.toBeNull();
  });

  it('leaves the button unmarked once everything has been seen', () => {
    const entry = renderEntryWithThreads([
      {id: 1, permaId: 5, subjectType: 'ContentElement', subjectId: 1,
       comments: [{id: 10, body: 'My own topic', creatorName: 'Alice',
                   creatorId: currentUser.id,
                   createdAt: '2026-08-17T09:00:00.000Z'}]}
    ]);

    expect(entry.getActivityButton().querySelector(`.${activityStyles.unseenDot}`))
      .toBeNull();
  });
});
