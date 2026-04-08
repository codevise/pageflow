import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {act, fireEvent, waitFor} from '@testing-library/react';

import {Entry} from 'frontend/Entry';
import {usePageObjects} from 'support/pageObjects';
import {renderInEntry} from 'support';
import {clearExtensions} from 'frontend/extensions';
import {loadCommentingComponents} from 'frontend/commenting';

describe('commenting badges', () => {
  usePageObjects();

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

  it('fetches threads from API and displays badge', async () => {
    window.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        currentUser: {id: 42, name: 'Alice'},
        commentThreads: [
          {id: 1, subjectType: 'ContentElement', subjectId: 1, comments: []}
        ]
      })
    });

    const {getByRole} = renderInEntry(<Entry />, {
      seed: {
        contentElements: [{
          typeName: 'withTestId',
          configuration: {testId: 5}
        }]
      }
    });

    await waitFor(() => {
      expect(getByRole('status')).toBeInTheDocument();
    });
  });

  it('shows thread list when clicking badge', async () => {
    window.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        currentUser: {id: 42, name: 'Alice'},
        commentThreads: [
          {id: 1, subjectType: 'ContentElement', subjectId: 1, comments: [
            {id: 10, body: 'Nice work', creatorName: 'Bob', creatorId: 2}
          ]}
        ]
      })
    });

    const {getByRole, getByText} = renderInEntry(<Entry />, {
      seed: {
        contentElements: [{
          typeName: 'withTestId',
          configuration: {testId: 5}
        }]
      }
    });

    await waitFor(() => {
      expect(getByRole('status')).toBeInTheDocument();
    });

    fireEvent.click(getByRole('status'));

    expect(getByText('Nice work')).toBeInTheDocument();
    expect(getByText('Bob')).toBeInTheDocument();
  });
});
