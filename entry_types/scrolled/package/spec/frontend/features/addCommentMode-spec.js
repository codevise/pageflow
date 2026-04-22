import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {act} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {useFakeTranslations} from 'pageflow/testHelpers';

import {Entry} from 'frontend/Entry';
import {api} from 'frontend/api';
import {usePageObjects} from 'support/pageObjects';
import {renderInEntry} from 'support';
import {clearExtensions} from 'frontend/extensions';
import {loadCommentingComponents} from 'frontend/commenting';

describe('add comment mode', () => {
  usePageObjects();

  useFakeTranslations({
    'pageflow_scrolled.review.add_comment': 'Add comment',
    'pageflow_scrolled.review.select_content_element': 'Select to comment',
    'pageflow_scrolled.review.add_comment_placeholder': 'Add a comment...',
    'pageflow_scrolled.review.new_topic': 'New topic',
    'pageflow_scrolled.review.send': 'Send',
    'pageflow_scrolled.review.cancel': 'Cancel',
    'pageflow_scrolled.review.cancel_add_comment': 'Cancel add comment'
  });

  beforeEach(() => {
    jest.spyOn(window, 'fetch').mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({currentUser: null, commentThreads: []})
    });

    loadCommentingComponents();
  });

  afterEach(() => {
    act(() => clearExtensions());
    window.fetch.mockRestore();
  });

  it('renders add comment button', () => {
    const {getByRole} = renderInEntry(<Entry />, {
      seed: {
        contentElements: [{
          typeName: 'withTestId',
          configuration: {testId: 5}
        }]
      }
    });

    expect(getByRole('button', {name: 'Add comment'})).toBeInTheDocument();
  });

  it('shows highlight overlays on content elements when activated', async () => {
    const user = userEvent.setup();
    const {getByRole} = renderInEntry(<Entry />, {
      seed: {
        contentElements: [{
          typeName: 'withTestId',
          configuration: {testId: 5}
        }]
      }
    });

    await user.click(getByRole('button', {name: 'Add comment'}));

    expect(getByRole('button', {name: 'Select to comment'})).toBeInTheDocument();
  });

  it('opens new thread form when selecting element', async () => {
    const user = userEvent.setup();
    const {getByRole, getByPlaceholderText} = renderInEntry(<Entry />, {
      seed: {
        contentElements: [{
          typeName: 'withTestId',
          configuration: {testId: 5}
        }]
      }
    });

    await user.click(getByRole('button', {name: 'Add comment'}));
    await user.click(getByRole('button', {name: 'Select to comment'}));

    expect(getByPlaceholderText('Add a comment...')).toBeInTheDocument();
  });

  it('auto expands new thread form when selecting element with existing threads', async () => {
    window.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        currentUser: null,
        commentThreads: [{
          id: 1,
          subjectType: 'ContentElement',
          subjectId: 10,
          comments: [{id: 1, body: 'Existing comment', createdAt: '2026-01-01T00:00:00Z'}]
        }]
      })
    });

    const user = userEvent.setup();
    const {getByRole, getByPlaceholderText} = renderInEntry(<Entry />, {
      seed: {
        contentElements: [{
          typeName: 'withTestId',
          permaId: 10,
          configuration: {testId: 5}
        }]
      }
    });

    await user.click(getByRole('button', {name: 'Add comment'}));
    await user.click(getByRole('button', {name: 'Select to comment'}));

    expect(getByPlaceholderText('Add a comment...')).toBeInTheDocument();
  });

  it('closes popover when cancelling new thread form on element without threads', async () => {
    const user = userEvent.setup();
    const {getByRole, queryByRole} = renderInEntry(<Entry />, {
      seed: {
        contentElements: [{
          typeName: 'withTestId',
          configuration: {testId: 5}
        }]
      }
    });

    await user.click(getByRole('button', {name: 'Add comment'}));
    await user.click(getByRole('button', {name: 'Select to comment'}));
    await user.click(getByRole('button', {name: 'Cancel'}));

    expect(queryByRole('status')).not.toBeInTheDocument();
  });

  it('exits add comment mode when overlay is clicked', async () => {
    const user = userEvent.setup();
    const {getByRole, queryByRole} = renderInEntry(<Entry />, {
      seed: {
        contentElements: [{
          typeName: 'withTestId',
          configuration: {testId: 5}
        }]
      }
    });

    await user.click(getByRole('button', {name: 'Add comment'}));
    expect(getByRole('button', {name: 'Select to comment'})).toBeInTheDocument();

    await user.click(getByRole('button', {name: 'Select to comment'}));

    expect(queryByRole('button', {name: 'Select to comment'})).not.toBeInTheDocument();
  });

  it('deactivates when clicking toggle button again', async () => {
    const user = userEvent.setup();
    const {getByRole, queryByRole} = renderInEntry(<Entry />, {
      seed: {
        contentElements: [{
          typeName: 'withTestId',
          configuration: {testId: 5}
        }]
      }
    });

    await user.click(getByRole('button', {name: 'Add comment'}));
    expect(getByRole('button', {name: 'Select to comment'})).toBeInTheDocument();

    await user.click(getByRole('button', {name: 'Cancel add comment'}));

    expect(queryByRole('button', {name: 'Select to comment'})).not.toBeInTheDocument();
  });

  it('does not show overlay on inlineComments elements', async () => {
    api.contentElementTypes.register('withInlineComments', {
      component: function WithInlineComments() {
        return <div data-testid="inlineCommentsElement" />;
      },
      inlineComments: true
    });

    const user = userEvent.setup();
    const {getByRole, queryAllByRole} = renderInEntry(<Entry />, {
      seed: {
        contentElements: [
          {typeName: 'withInlineComments'},
          {typeName: 'withTestId', configuration: {testId: 5}}
        ]
      }
    });

    await user.click(getByRole('button', {name: 'Add comment'}));

    expect(queryAllByRole('button', {name: 'Select to comment'})).toHaveLength(1);
  });

  it('exits add comment mode when clicking outside', async () => {
    const user = userEvent.setup();
    const {getByRole, queryByRole} = renderInEntry(<Entry />, {
      seed: {
        contentElements: [{
          typeName: 'withTestId',
          configuration: {testId: 5}
        }]
      }
    });

    await user.click(getByRole('button', {name: 'Add comment'}));
    expect(getByRole('button', {name: 'Select to comment'})).toBeInTheDocument();

    await user.click(document.body);

    expect(queryByRole('button', {name: 'Select to comment'})).not.toBeInTheDocument();
  });
});
