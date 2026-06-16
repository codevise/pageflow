import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import {useFakeTranslations} from 'pageflow/testHelpers';

import {api} from 'frontend/api';
import {renderEntry, useCommentingPageObjects} from 'support/pageObjects/commenting';

describe('add comment mode', () => {
  useCommentingPageObjects();

  useFakeTranslations({
    'pageflow_scrolled.review.cancel': 'Cancel'
  });

  it('renders add comment button', () => {
    const entry = renderEntry({
      seed: {
        contentElements: [{
          typeName: 'withTestId',
          configuration: {testId: 5}
        }]
      }
    });

    expect(entry.getAddCommentButton()).toBeInTheDocument();
  });

  it('shows highlight overlays on content elements when activated', async () => {
    const user = userEvent.setup();
    const entry = renderEntry({
      seed: {
        contentElements: [{
          typeName: 'withTestId',
          configuration: {testId: 5}
        }]
      }
    });

    await user.click(entry.getAddCommentButton());

    expect(entry.getContentElementByTestId(5).hasSelectToCommentButton()).toBe(true);
  });

  it('opens new thread form when selecting element', async () => {
    const user = userEvent.setup();
    const entry = renderEntry({
      seed: {
        contentElements: [{
          typeName: 'withTestId',
          configuration: {testId: 5}
        }]
      }
    });

    await user.click(entry.getAddCommentButton());
    await user.click(entry.getContentElementByTestId(5).getSelectToCommentButton());

    expect(entry.getNewThreadInput()).toBeInTheDocument();
  });

  it('auto expands new thread form when selecting element with existing threads', async () => {
    const user = userEvent.setup();
    const entry = renderEntry({
      seed: {
        contentElements: [{
          typeName: 'withTestId',
          permaId: 10,
          configuration: {testId: 5}
        }]
      },
      commenting: {
        currentUser: null,
        commentThreads: [{
          id: 1,
          subjectType: 'ContentElement',
          subjectId: 10,
          comments: [{id: 1, body: 'Existing comment', createdAt: '2026-01-01T00:00:00Z'}]
        }]
      }
    });

    await user.click(entry.getAddCommentButton());
    await user.click(entry.getContentElementByTestId(5).getSelectToCommentButton());

    expect(entry.getNewThreadInput()).toBeInTheDocument();
  });

  it('closes popover when cancelling new thread form on element without threads', async () => {
    const user = userEvent.setup();
    const entry = renderEntry({
      seed: {
        contentElements: [{
          typeName: 'withTestId',
          configuration: {testId: 5}
        }]
      }
    });

    await user.click(entry.getAddCommentButton());
    await user.click(entry.getContentElementByTestId(5).getSelectToCommentButton());
    await user.click(entry.getByRole('button', {name: 'Cancel'}));

    expect(entry.queryAllCommentBadges()).toHaveLength(0);
  });

  it('exits add comment mode when overlay is clicked', async () => {
    const user = userEvent.setup();
    const entry = renderEntry({
      seed: {
        contentElements: [{
          typeName: 'withTestId',
          configuration: {testId: 5}
        }]
      }
    });

    await user.click(entry.getAddCommentButton());
    const contentElement = entry.getContentElementByTestId(5);
    expect(contentElement.hasSelectToCommentButton()).toBe(true);

    await user.click(contentElement.getSelectToCommentButton());

    expect(contentElement.hasSelectToCommentButton()).toBe(false);
  });

  it('deactivates when clicking toggle button again', async () => {
    const user = userEvent.setup();
    const entry = renderEntry({
      seed: {
        contentElements: [{
          typeName: 'withTestId',
          configuration: {testId: 5}
        }]
      }
    });

    await user.click(entry.getAddCommentButton());
    const contentElement = entry.getContentElementByTestId(5);
    expect(contentElement.hasSelectToCommentButton()).toBe(true);

    await user.click(entry.getCancelAddCommentButton());

    expect(contentElement.hasSelectToCommentButton()).toBe(false);
  });

  it('does not show overlay on inlineComments elements', async () => {
    api.contentElementTypes.register('withInlineComments', {
      component: function WithInlineComments() {
        return <div data-testid="inlineCommentsElement" />;
      },
      inlineComments: true
    });

    const user = userEvent.setup();
    const entry = renderEntry({
      seed: {
        contentElements: [
          {typeName: 'withInlineComments'},
          {typeName: 'withTestId', configuration: {testId: 5}}
        ]
      }
    });

    await user.click(entry.getAddCommentButton());

    expect(entry.queryAllByRole('button', {name: 'Select to comment'})).toHaveLength(1);
  });

  it('exits add comment mode when clicking outside', async () => {
    const user = userEvent.setup();
    const entry = renderEntry({
      seed: {
        contentElements: [{
          typeName: 'withTestId',
          configuration: {testId: 5}
        }]
      }
    });

    await user.click(entry.getAddCommentButton());
    const contentElement = entry.getContentElementByTestId(5);
    expect(contentElement.hasSelectToCommentButton()).toBe(true);

    await user.click(document.body);

    expect(contentElement.hasSelectToCommentButton()).toBe(false);
  });

  it('opens new thread form when selecting a section', async () => {
    const user = userEvent.setup();
    const entry = renderEntry({
      seed: {
        sections: [{id: 1, permaId: 10}],
        contentElements: [{typeName: 'withTestId', configuration: {testId: 5}}]
      }
    });

    await user.click(entry.getAddCommentButton());
    await user.click(entry.getByRole('button', {name: 'Select section to comment'}));

    expect(entry.getNewThreadInput()).toBeInTheDocument();
  });
});
