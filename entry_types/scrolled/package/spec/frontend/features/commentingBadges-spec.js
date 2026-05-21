import '@testing-library/jest-dom/extend-expect';
import {act, fireEvent, waitFor} from '@testing-library/react';

import {renderEntry, usePageObjects} from 'support/pageObjects';
import {clearExtensions} from 'frontend/extensionRegistry';
import {loadCommentingComponents} from 'frontend/commenting';

describe('commenting badges', () => {
  usePageObjects();

  beforeEach(async () => {
    await loadCommentingComponents();
  });

  afterEach(() => {
    act(() => clearExtensions());
  });

  it('fetches threads from API and displays badge', async () => {
    jest.spyOn(window, 'fetch').mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        currentUser: {id: 42, name: 'Alice'},
        commentThreads: [
          {id: 1, subjectType: 'ContentElement', subjectId: 1, comments: []}
        ]
      })
    });

    const {getByRole} = renderEntry({
      seed: {
        contentElements: [{
          typeName: 'withTestId',
          configuration: {testId: 5}
        }]
      },
      commenting: null
    });

    await waitFor(() => {
      expect(getByRole('status')).toBeInTheDocument();
    });
  });

  it('shows thread list when clicking badge', () => {
    const {getByRole, getByText} = renderEntry({
      seed: {
        contentElements: [{
          typeName: 'withTestId',
          configuration: {testId: 5}
        }]
      },
      commenting: {
        currentUser: {id: 42, name: 'Alice'},
        commentThreads: [
          {id: 1, subjectType: 'ContentElement', subjectId: 1, comments: [
            {id: 10, body: 'Nice work', creatorName: 'Bob', creatorId: 2}
          ]}
        ]
      }
    });

    fireEvent.click(getByRole('status'));

    expect(getByText('Nice work')).toBeInTheDocument();
    expect(getByText('Bob')).toBeInTheDocument();
  });
});
