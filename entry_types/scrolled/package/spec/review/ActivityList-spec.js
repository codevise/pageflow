import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import {useFakeTranslations} from 'pageflow/testHelpers';

import {ActivityList} from 'review/ActivityList';
import {renderWithReviewState} from 'support/renderWithReviewState';

// ActivityList resolves its entries from the located threads, so the
// subjects the threads hang off have to exist in the entry structure.
const seed = {
  sections: [{id: 1, permaId: 100}],
  contentElements: [{id: 1, permaId: 10, sectionId: 1, typeName: 'textBlock'}]
};

const currentUser = {id: 42, name: 'Alice'};

function renderActivityList(ui, options = {}) {
  return renderWithReviewState(ui, {seed, currentUser, ...options});
}

function thread({id = 1, comments = [], ...rest}) {
  return {
    id,
    permaId: id + 4,
    subjectType: 'ContentElement',
    subjectId: 10,
    comments,
    ...rest
  };
}

function comment({id = 100, creatorId = 43, creatorName = 'Bob', body = 'A comment', createdAt, ...rest}) {
  return {id, creatorId, creatorName, body, createdAt, ...rest};
}

describe('ActivityList', () => {
  useFakeTranslations({
    'pageflow_scrolled.review.activity.no_activity_yet': 'No activity yet',
    'pageflow_scrolled.review.activity.show_more': 'Show more',
    'pageflow_scrolled.review.refers_to_deleted_element': 'Refers to a deleted element',
    'pageflow_scrolled.review.earlier_reply_count.one': '1 more',
    'pageflow_scrolled.review.earlier_reply_count.other': '%{count} more',
    'pageflow_scrolled.review.reply_count.one': '1 reply',
    'pageflow_scrolled.review.reply_count.other': '%{count} replies',
    'pageflow_scrolled.review.reply_placeholder': 'Reply...',
    'pageflow_scrolled.review.send': 'Send',
    'pageflow_scrolled.review.toggle_replies': 'Toggle replies',
    'pageflow_scrolled.review.resolution_by': 'Marked as resolved by',
    'pageflow_scrolled.review.resolve': 'Mark as resolved',
    'pageflow_scrolled.review.unresolve': 'Mark as unresolved'
  });

  it('shows who resolved a thread', () => {
    const {getByText} = renderActivityList(<ActivityList />, {
      commentThreads: [thread({
        comments: [comment({body: 'A topic', createdAt: '2026-08-17T09:00:00.000Z'})],
        resolvedAt: '2026-08-17T10:00:00.000Z',
        resolvedById: 44,
        resolverName: 'Carol'
      })]
    });

    expect(getByText('Marked as resolved by')).toBeInTheDocument();
    expect(getByText('Carol')).toBeInTheDocument();
  });

  it('lists threads with the most recent activity first', () => {
    const {getAllByText} = renderActivityList(<ActivityList />, {
      commentThreads: [
        thread({
          id: 1,
          comments: [comment({
            id: 100, creatorName: 'Bob', body: 'Older topic',
            createdAt: '2026-08-17T09:00:00.000Z'
          })]
        }),
        thread({
          id: 2,
          comments: [comment({
            id: 200, creatorName: 'Carol', body: 'Newer topic',
            createdAt: '2026-08-17T11:00:00.000Z'
          })]
        })
      ]
    });

    expect(getAllByText(/^(Newer|Older) topic$/).map(node => node.textContent))
      .toEqual(['Newer topic', 'Older topic']);
  });

  it('renders a blank slate without any activity', () => {
    const {getByText} = renderActivityList(<ActivityList />);

    expect(getByText('No activity yet')).toBeInTheDocument();
  });

  it('leaves pointing out a deleted element to the thread', () => {
    const {getByText} = renderActivityList(<ActivityList />, {
      commentThreads: [thread({
        subjectId: 999,
        sectionPermaId: 100,
        comments: [comment({body: 'A topic', createdAt: '2026-08-17T09:00:00.000Z'})]
      })]
    });

    expect(getByText('Refers to a deleted element')).toBeInTheDocument();
  });

  describe('embedded thread', () => {
    const threadWithReplies = thread({
      comments: [
        comment({id: 100, body: 'A topic', createdAt: '2026-08-17T09:00:00.000Z'}),
        comment({id: 101, body: 'First reply', createdAt: '2026-08-17T10:00:00.000Z'}),
        comment({id: 102, body: 'Second reply', createdAt: '2026-08-17T11:00:00.000Z'})
      ]
    });

    // The headline names the latest event, so the row has to show it.
    it('shows the opening comment and the latest reply', () => {
      const {getByText, queryByText} = renderActivityList(<ActivityList />, {
        commentThreads: [threadWithReplies]
      });

      expect(getByText('A topic')).toBeInTheDocument();
      expect(getByText('Second reply')).toBeInTheDocument();
      expect(getByText('1 more')).toBeInTheDocument();
      expect(queryByText('First reply')).toBeNull();
    });

    it('expands the discussion in place', async () => {
      const user = userEvent.setup();

      const {getByRole, getByText} = renderActivityList(<ActivityList />, {
        commentThreads: [threadWithReplies]
      });

      await user.click(getByRole('button', {name: '1 more'}));

      expect(getByText('First reply')).toBeInTheDocument();
      expect(getByText('Second reply')).toBeInTheDocument();
    });

    it('offers the reply form only once expanded', async () => {
      const user = userEvent.setup();

      const {getByRole, getByPlaceholderText, queryByPlaceholderText} =
        renderActivityList(<ActivityList />, {commentThreads: [threadWithReplies]});

      expect(queryByPlaceholderText('Reply...')).toBeNull();

      await user.click(getByRole('button', {name: '1 more'}));

      expect(getByPlaceholderText('Reply...')).toBeInTheDocument();
    });

    it('offers no reply count toggle while replies are folded', () => {
      const {queryByRole} = renderActivityList(<ActivityList />, {
        commentThreads: [threadWithReplies]
      });

      expect(queryByRole('button', {name: /2 replies/})).toBeNull();
    });

    it('collapses the row through the reply count once nothing is folded', async () => {
      const user = userEvent.setup();

      const {getByRole, getByText, queryByText} = renderActivityList(<ActivityList />, {
        commentThreads: [threadWithReplies]
      });

      await user.click(getByRole('button', {name: '1 more'}));
      await user.click(getByRole('button', {name: /2 replies/}));

      expect(getByText('A topic')).toBeInTheDocument();
      expect(queryByText('First reply')).toBeNull();
      expect(queryByText('Second reply')).toBeNull();
    });

    it('offers resolving without expanding', () => {
      const {getByRole} = renderActivityList(<ActivityList />, {
        commentThreads: [threadWithReplies]
      });

      expect(getByRole('button', {name: 'Mark as resolved'})).toBeInTheDocument();
    });
  });

  describe('interaction', () => {
    function renderTwoEntries(ui) {
      return renderActivityList(ui, {
        commentThreads: [
          thread({
            id: 1,
            comments: [comment({
              id: 100, creatorName: 'Bob', body: 'Older topic',
              createdAt: '2026-08-17T09:00:00.000Z'
            })]
          }),
          thread({
            id: 2,
            comments: [comment({
              id: 200, creatorName: 'Carol', body: 'Newer topic',
              createdAt: '2026-08-17T11:00:00.000Z'
            })]
          })
        ]
      });
    }

    it('passes the entry of a clicked thread to onEntryClick', async () => {
      const user = userEvent.setup();
      const onEntryClick = jest.fn();

      const {getByText} = renderTwoEntries(<ActivityList onEntryClick={onEntryClick} />);

      await user.click(getByText('Older topic'));

      expect(onEntryClick).toHaveBeenCalledWith(
        expect.objectContaining({threadId: 1})
      );
    });

    it('marks the thread of the highlighted entry as current', () => {
      const {getByText} = renderTwoEntries(<ActivityList highlightedThreadId={1} />);

      expect(getByText('Older topic').closest('[aria-current]')).not.toBeNull();
      expect(getByText('Newer topic').closest('[aria-current]')).toBeNull();
    });
  });

  describe('paging', () => {
    function renderPagedEntries(ui) {
      return renderActivityList(ui, {
        commentThreads: [1, 2, 3].map(id => thread({
          id,
          comments: [comment({
            id: id * 100, body: `Topic ${id}`, createdAt: `2026-08-1${id}T09:00:00.000Z`
          })]
        }))
      });
    }

    it('shows only a first page of entries', () => {
      const {getByText, queryByText} = renderPagedEntries(<ActivityList pageSize={2} />);

      expect(getByText('Topic 3')).toBeInTheDocument();
      expect(getByText('Topic 2')).toBeInTheDocument();
      expect(queryByText('Topic 1')).toBeNull();
    });

    it('extends the list on show more', async () => {
      const user = userEvent.setup();

      const {getByRole, getByText} = renderPagedEntries(<ActivityList pageSize={2} />);

      await user.click(getByRole('button', {name: 'Show more'}));

      expect(getByText('Topic 1')).toBeInTheDocument();
    });

    it('offers no show more button once everything is shown', () => {
      const {queryByRole} = renderPagedEntries(<ActivityList pageSize={3} />);

      expect(queryByRole('button', {name: 'Show more'})).toBeNull();
    });
  });
});
