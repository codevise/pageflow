import '@testing-library/jest-dom/extend-expect';
import {fireEvent, waitFor} from '@testing-library/react';
import {enableFetchMocks} from 'jest-fetch-mock';

import {renderEntry, useCommentingPageObjects} from 'support/pageObjects/commenting';

enableFetchMocks();

describe('commenting badges', () => {
  useCommentingPageObjects();

  it('fetches threads from API and displays badge', async () => {
    fetch.mockResponse(JSON.stringify({
      currentUser: {id: 42, name: 'Alice'},
      commentThreads: [
        {id: 1, subjectType: 'ContentElement', subjectId: 1, comments: []}
      ]
    }));

    const entry = renderEntry({
      seed: {
        contentElements: [{
          typeName: 'withTestId',
          configuration: {testId: 5}
        }]
      },
      commenting: null
    });

    await waitFor(() => {
      expect(entry.queryAllCommentBadges()).toHaveLength(1);
    });
  });

  it('shows thread list when clicking badge', () => {
    const entry = renderEntry({
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

    fireEvent.click(entry.getAllCommentBadges()[0]);

    expect(entry.getByText('Nice work')).toBeInTheDocument();
    expect(entry.getByText('Bob')).toBeInTheDocument();
  });

  it('shows thread list when clicking a section badge', () => {
    const entry = renderEntry({
      seed: {
        sections: [{id: 1, permaId: 10}],
        contentElements: [{typeName: 'withTestId', configuration: {testId: 5}}]
      },
      commenting: {
        currentUser: {id: 42, name: 'Alice'},
        commentThreads: [
          {id: 1, subjectType: 'Section', subjectId: 10, comments: [
            {id: 10, body: 'On the section', creatorName: 'Bob', creatorId: 2}
          ]}
        ]
      }
    });

    fireEvent.click(entry.getAllCommentBadges()[0]);

    expect(entry.getByText('On the section')).toBeInTheDocument();
  });

  it('shows a deleted element thread in the section thread list', () => {
    const entry = renderEntry({
      seed: {
        sections: [{id: 1, permaId: 10}],
        contentElements: [{typeName: 'withTestId', configuration: {testId: 5}}]
      },
      commenting: {
        currentUser: {id: 42, name: 'Alice'},
        commentThreads: [
          {id: 1, subjectType: 'Section', subjectId: 10, comments: [
            {id: 10, body: 'On the section', creatorName: 'Bob', creatorId: 2}
          ]},
          {id: 2, subjectType: 'ContentElement', subjectId: 999, sectionPermaId: 10, comments: [
            {id: 20, body: 'On a deleted element', creatorName: 'Eve', creatorId: 3}
          ]}
        ]
      }
    });

    fireEvent.click(entry.getAllCommentBadges()[0]);

    expect(entry.getByText('On a deleted element')).toBeInTheDocument();
    expect(entry.getByText('Refers to a deleted element')).toBeInTheDocument();
  });

  it('shows a section badge for a section whose only thread is on a deleted element', () => {
    const entry = renderEntry({
      seed: {
        sections: [{id: 1, permaId: 10}],
        contentElements: [{typeName: 'withTestId', configuration: {testId: 5}}]
      },
      commenting: {
        currentUser: {id: 42, name: 'Alice'},
        commentThreads: [
          {id: 1, subjectType: 'ContentElement', subjectId: 999, sectionPermaId: 10, comments: [
            {id: 10, body: 'On a deleted element', creatorName: 'Bob', creatorId: 2}
          ]}
        ]
      }
    });

    fireEvent.click(entry.getAllCommentBadges()[0]);

    expect(entry.getByText('On a deleted element')).toBeInTheDocument();
    expect(entry.getByText('Refers to a deleted element')).toBeInTheDocument();
  });

  it('closes the thread list when clicking outside', () => {
    const entry = renderEntry({
      seed: {
        sections: [{id: 1, permaId: 10}],
        contentElements: [{typeName: 'withTestId', configuration: {testId: 5}}]
      },
      commenting: {
        currentUser: {id: 42, name: 'Alice'},
        commentThreads: [
          {id: 1, subjectType: 'Section', subjectId: 10, comments: [
            {id: 10, body: 'On the section', creatorName: 'Bob', creatorId: 2}
          ]}
        ]
      }
    });

    fireEvent.click(entry.getAllCommentBadges()[0]);
    expect(entry.getByText('On the section')).toBeInTheDocument();

    fireEvent.mouseDown(document.body);

    expect(entry.queryByText('On the section')).not.toBeInTheDocument();
  });

  it('closes the thread list when pressing Escape', () => {
    const entry = renderEntry({
      seed: {
        sections: [{id: 1, permaId: 10}],
        contentElements: [{typeName: 'withTestId', configuration: {testId: 5}}]
      },
      commenting: {
        currentUser: {id: 42, name: 'Alice'},
        commentThreads: [
          {id: 1, subjectType: 'Section', subjectId: 10, comments: [
            {id: 10, body: 'On the section', creatorName: 'Bob', creatorId: 2}
          ]}
        ]
      }
    });

    fireEvent.click(entry.getAllCommentBadges()[0]);
    expect(entry.getByText('On the section')).toBeInTheDocument();

    fireEvent.keyDown(document, {key: 'Escape'});

    expect(entry.queryByText('On the section')).not.toBeInTheDocument();
  });
});
