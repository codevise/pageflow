import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import I18n from 'i18n-js';
import {useFakeTranslations} from 'pageflow/testHelpers';

import {act} from '@testing-library/react';

import {ActivityList} from 'review/ActivityList';
import styles from 'review/ActivityList.module.css';
import {renderWithReviewState} from 'support/renderWithReviewState';
import {simulateScrollingIntoView} from 'support/fakeIntersectionObserver';

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
    'pageflow_scrolled.review.activity.summary.topic': 'topic started',
    'pageflow_scrolled.review.activity.summary.reply_count.one': '1 reply',
    'pageflow_scrolled.review.activity.summary.reply_count.other': '%{count} replies',
    'pageflow_scrolled.review.activity.summary.resolution': 'marked as resolved',
    'pageflow_scrolled.review.activity.summary.and': ' and ',
    'pageflow_scrolled.review.activity.today': 'Today',
    'pageflow_scrolled.review.activity.yesterday': 'Yesterday',
    'pageflow_scrolled.review.refers_to_deleted_element': 'Refers to a deleted element',
    'pageflow_scrolled.review.earlier_reply_count.one': '1 more',
    'pageflow_scrolled.review.earlier_reply_count.other': '%{count} more',
    'pageflow_scrolled.review.reply_count.one': '1 reply',
    'pageflow_scrolled.review.reply_count.other': '%{count} replies',
    'pageflow_scrolled.review.reply_placeholder': 'Reply...',
    'pageflow_scrolled.review.send': 'Send',
    'pageflow_scrolled.review.toggle_replies': 'Toggle replies',
    'pageflow_scrolled.review.unread_count.one': '1 unread',
    'pageflow_scrolled.review.unread_count.other': '%{count} unread',
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

  describe('summary', () => {
    function summaryOf(container) {
      return container.querySelector(`.${styles.summary}`);
    }

    // Everything counts as new without a read mark, so the tests about
    // the plain wording have to say the thread was read.
    const seen = {5: '2026-08-18T12:00:00.000Z'};

    it('names a topic started on the day it is listed under', () => {
      const {container} = renderActivityList(<ActivityList />, {
        commentThreads: [thread({
          comments: [comment({body: 'A topic', createdAt: '2026-08-17T09:00:00.000Z'})]
        })],
        commentThreadReads: seen
      });

      expect(summaryOf(container)).toHaveTextContent('topic started');
    });

    it('counts the replies of that day', () => {
      const {container} = renderActivityList(<ActivityList />, {
        commentThreads: [thread({
          comments: [
            comment({id: 100, body: 'A topic', createdAt: '2026-08-16T12:00:00.000Z'}),
            comment({id: 101, body: 'First', createdAt: '2026-08-17T12:00:00.000Z'}),
            comment({id: 102, body: 'Second', createdAt: '2026-08-17T13:00:00.000Z'})
          ]
        })],
        commentThreadReads: seen
      });

      expect(summaryOf(container)).toHaveTextContent('2 replies');
    });

    it('joins what happened on that day', () => {
      const {container} = renderActivityList(<ActivityList />, {
        commentThreads: [thread({
          comments: [
            comment({id: 100, body: 'A topic', createdAt: '2026-08-17T09:00:00.000Z'}),
            comment({id: 101, body: 'A reply', createdAt: '2026-08-17T12:00:00.000Z'})
          ],
          resolvedAt: '2026-08-17T13:00:00.000Z',
          resolvedById: 44,
          resolverName: 'Carol'
        })],
        commentThreadReads: seen
      });

      expect(summaryOf(container))
        .toHaveTextContent('topic started, 1 reply and marked as resolved');
    });

    it('counts a day\'s replies whether or not they have been read', () => {
      const {container} = renderActivityList(<ActivityList />, {
        commentThreads: [thread({
          permaId: 7,
          comments: [
            comment({id: 100, body: 'A topic', createdAt: '2026-08-16T12:00:00.000Z'}),
            comment({id: 101, body: 'First', createdAt: '2026-08-17T12:00:00.000Z'}),
            comment({id: 102, body: 'Second', createdAt: '2026-08-17T13:00:00.000Z'})
          ]
        })],
        commentThreadReads: {7: '2026-08-17T12:30:00.000Z'}
      });

      expect(summaryOf(container).textContent).toEqual('2 replies');
    });

    it('leaves out what happened on other days', () => {
      const {container} = renderActivityList(<ActivityList />, {
        commentThreads: [thread({
          comments: [
            comment({id: 100, body: 'A topic', createdAt: '2026-08-16T12:00:00.000Z'}),
            comment({id: 101, body: 'A reply', createdAt: '2026-08-17T12:00:00.000Z'})
          ]
        })],
        commentThreadReads: seen
      });

      expect(summaryOf(container).textContent).toEqual('1 reply');
    });
  });

  describe('embedded thread', () => {
    const threadWithReplies = thread({
      comments: [
        comment({id: 100, body: 'A topic', createdAt: '2026-08-17T09:00:00.000Z'}),
        comment({id: 101, body: 'First reply', createdAt: '2026-08-17T10:00:00.000Z'}),
        comment({id: 102, body: 'Second reply', createdAt: '2026-08-17T12:00:00.000Z'})
      ]
    });

    // Unseen comments show whatever day they are from, so the tests about
    // folding have to say the thread was read.
    const seenAll = {5: '2026-08-18T12:00:00.000Z'};

    const threadAcrossDays = thread({
      comments: [
        comment({id: 100, body: 'A topic', createdAt: '2026-08-16T12:00:00.000Z'}),
        comment({id: 101, body: 'First reply', createdAt: '2026-08-16T13:00:00.000Z'}),
        comment({id: 102, body: 'Second reply', createdAt: '2026-08-17T12:00:00.000Z'})
      ]
    });

    it('shows every reply made on the day it is listed under', () => {
      const {getByText, queryByText} = renderActivityList(<ActivityList />, {
        commentThreads: [threadWithReplies]
      });

      expect(getByText('A topic')).toBeInTheDocument();
      expect(getByText('First reply')).toBeInTheDocument();
      expect(getByText('Second reply')).toBeInTheDocument();
      expect(queryByText('1 more')).toBeNull();
    });

    it('folds away replies from earlier days', () => {
      const {getByText, queryByText} = renderActivityList(<ActivityList />, {
        commentThreads: [threadAcrossDays],
        commentThreadReads: seenAll
      });

      expect(getByText('A topic')).toBeInTheDocument();
      expect(getByText('Second reply')).toBeInTheDocument();
      expect(getByText('1 more')).toBeInTheDocument();
      expect(queryByText('First reply')).toBeNull();
    });

    it('shows the latest reply when the day contributed none', () => {
      const {getByText} = renderActivityList(<ActivityList />, {
        commentThreads: [thread({
          comments: [
            comment({id: 100, body: 'A topic', createdAt: '2026-08-16T12:00:00.000Z'}),
            comment({id: 101, body: 'Only reply', createdAt: '2026-08-16T13:00:00.000Z'})
          ],
          resolvedAt: '2026-08-17T12:00:00.000Z',
          resolvedById: 44,
          resolverName: 'Carol'
        })]
      });

      expect(getByText('Only reply')).toBeInTheDocument();
    });

    it('expands the discussion in place', async () => {
      const user = userEvent.setup();

      const {getByRole, getByText} = renderActivityList(<ActivityList />, {
        commentThreads: [threadAcrossDays],
        commentThreadReads: seenAll
      });

      await user.click(getByRole('button', {name: '1 more'}));

      expect(getByText('First reply')).toBeInTheDocument();
      expect(getByText('Second reply')).toBeInTheDocument();
    });

    it('offers the reply form only once expanded', async () => {
      const user = userEvent.setup();

      const {getByRole, getByPlaceholderText, queryByPlaceholderText} =
        renderActivityList(<ActivityList />, {
          commentThreads: [threadAcrossDays],
          commentThreadReads: seenAll
        });

      expect(queryByPlaceholderText('Reply...')).toBeNull();

      await user.click(getByRole('button', {name: '1 more'}));

      expect(getByPlaceholderText('Reply...')).toBeInTheDocument();
    });

    it('offers no reply count toggle while replies are folded', () => {
      const {queryByRole} = renderActivityList(<ActivityList />, {
        commentThreads: [threadAcrossDays],
        commentThreadReads: seenAll
      });

      expect(queryByRole('button', {name: /2 replies/})).toBeNull();
    });

    it('collapses the row through the reply count once nothing is folded', async () => {
      const user = userEvent.setup();

      const {getByRole, getByText, queryByText} = renderActivityList(<ActivityList />, {
        commentThreads: [threadAcrossDays],
        commentThreadReads: seenAll
      });

      await user.click(getByRole('button', {name: '1 more'}));
      await user.click(getByRole('button', {name: /2 replies/}));

      expect(getByText('A topic')).toBeInTheDocument();
      expect(queryByText('First reply')).toBeNull();
      expect(queryByText('Second reply')).toBeNull();
    });

    it('offers resolving without expanding', () => {
      const {getByRole} = renderActivityList(<ActivityList />, {
        commentThreads: [threadAcrossDays]
      });

      expect(getByRole('button', {name: 'Mark as resolved'})).toBeInTheDocument();
    });
  });

  describe('unseen activity', () => {
    // Read state is per thread, so a reply left unread days ago sits above
    // the day the row is listed under. Folding it away would hide the very
    // thing the feed exists to surface.
    const threadWithUnseenReplyFromEarlierDay = thread({
      permaId: 7,
      comments: [
        comment({id: 100, body: 'A topic', createdAt: '2026-08-15T12:00:00.000Z'}),
        comment({id: 101, body: 'Unseen reply', createdAt: '2026-08-16T12:00:00.000Z'}),
        comment({id: 102, body: 'Latest reply', createdAt: '2026-08-17T12:00:00.000Z'})
      ]
    });

    it('marks a thread with unseen comments', () => {
      const {getByLabelText} = renderActivityList(<ActivityList />, {
        commentThreads: [threadWithUnseenReplyFromEarlierDay],
        commentThreadReads: {}
      });

      expect(getByLabelText('3 unread')).toBeInTheDocument();
    });

    it('does not mark a thread the reviewer has seen', () => {
      const {queryByLabelText} = renderActivityList(<ActivityList />, {
        commentThreads: [threadWithUnseenReplyFromEarlierDay],
        commentThreadReads: {7: '2026-08-18T12:00:00.000Z'}
      });

      expect(queryByLabelText('1 unread')).toBeNull();
      expect(queryByLabelText('2 unread')).toBeNull();
    });

    it('shows unseen replies from earlier days', () => {
      const {getByText} = renderActivityList(<ActivityList />, {
        commentThreads: [threadWithUnseenReplyFromEarlierDay],
        commentThreadReads: {7: '2026-08-15T18:00:00.000Z'}
      });

      expect(getByText('Unseen reply')).toBeInTheDocument();
      expect(getByText('Latest reply')).toBeInTheDocument();
    });

    it('folds away seen replies from earlier days', () => {
      const {getByText, queryByText} = renderActivityList(<ActivityList />, {
        commentThreads: [threadWithUnseenReplyFromEarlierDay],
        commentThreadReads: {7: '2026-08-18T12:00:00.000Z'}
      });

      expect(queryByText('Unseen reply')).toBeNull();
      expect(getByText('1 more')).toBeInTheDocument();
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

  describe('date groups', () => {
    // Relative labels need a fixed today to be worth asserting.
    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2026-08-24T12:00:00.000Z'));
      I18n.locale = 'en';
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    function dayThread({id, createdAt}) {
      return thread({
        id,
        comments: [comment({id: id * 100, body: `Topic ${id}`, createdAt})]
      });
    }

    function renderDays(ui, days) {
      return renderActivityList(ui, {commentThreads: days.map(dayThread)});
    }

    it('heads the rows of today with a relative label', () => {
      const {getByRole} = renderDays(<ActivityList />, [
        {id: 1, createdAt: '2026-08-24T09:00:00.000Z'}
      ]);

      expect(getByRole('heading', {name: 'Today'})).toBeInTheDocument();
    });

    it('heads the rows of the day before with a relative label', () => {
      const {getByRole} = renderDays(<ActivityList />, [
        {id: 1, createdAt: '2026-08-23T09:00:00.000Z'}
      ]);

      expect(getByRole('heading', {name: 'Yesterday'})).toBeInTheDocument();
    });

    it('heads earlier rows with their date', () => {
      const {getByRole} = renderDays(<ActivityList />, [
        {id: 1, createdAt: '2026-08-17T09:00:00.000Z'}
      ]);

      expect(getByRole('heading', {name: 'Aug 17'})).toBeInTheDocument();
    });

    it('includes the year for rows of previous years', () => {
      const {getByRole} = renderDays(<ActivityList />, [
        {id: 1, createdAt: '2025-08-17T09:00:00.000Z'}
      ]);

      expect(getByRole('heading', {name: 'Aug 17, 2025'})).toBeInTheDocument();
    });

    it('heads each day once, in the order of the rows', () => {
      const {getAllByRole} = renderDays(<ActivityList />, [
        {id: 1, createdAt: '2026-08-24T09:00:00.000Z'},
        {id: 2, createdAt: '2026-08-24T11:00:00.000Z'},
        {id: 3, createdAt: '2026-08-23T09:00:00.000Z'}
      ]);

      expect(getAllByRole('heading').map(node => node.textContent))
        .toEqual(['Today', 'Yesterday']);
    });

    it('groups the rows under the heading of their day', () => {
      const {getByRole, getByText} = renderDays(<ActivityList />, [
        {id: 1, createdAt: '2026-08-24T09:00:00.000Z'},
        {id: 2, createdAt: '2026-08-23T09:00:00.000Z'}
      ]);

      const yesterday = getByRole('heading', {name: 'Yesterday'});

      expect(yesterday.compareDocumentPosition(getByText('Topic 1')) &
             Node.DOCUMENT_POSITION_PRECEDING).toBeTruthy();
      expect(yesterday.compareDocumentPosition(getByText('Topic 2')) &
             Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    });

    it('carries a machine readable date on the heading', () => {
      const {getByRole} = renderDays(<ActivityList />, [
        {id: 1, createdAt: '2026-08-17T09:00:00.000Z'}
      ]);

      expect(getByRole('heading', {name: 'Aug 17'}).querySelector('time'))
        .toHaveAttribute('dateTime', '2026-08-17');
    });

    it('heads a day only once when it is split across pages', () => {
      const {getAllByRole} = renderDays(<ActivityList pageSize={1} />, [
        {id: 1, createdAt: '2026-08-24T09:00:00.000Z'},
        {id: 2, createdAt: '2026-08-24T11:00:00.000Z'}
      ]);

      expect(getAllByRole('heading').map(node => node.textContent)).toEqual(['Today']);
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
  describe('marking read', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
      jest.restoreAllMocks();
    });

    const unreadThread = thread({
      id: 1,
      comments: [comment({id: 100, body: 'A topic', createdAt: '2026-08-17T09:00:00.000Z'})]
    });

    function renderWithPostMessage(ui) {
      const postMessage = jest.spyOn(window.top, 'postMessage').mockImplementation(() => {});

      return {
        ...renderActivityList(ui, {commentThreads: [unreadThread]}),
        postMessage
      };
    }

    function markReadMessages(postMessage) {
      return postMessage.mock.calls.filter(([message]) => message.type === 'MARK_THREADS_READ');
    }

    it('leaves a row the reviewer only scrolled past unread', () => {
      const {container, postMessage} = renderWithPostMessage(<ActivityList />);

      simulateScrollingIntoView(container);
      act(() => jest.advanceTimersByTime(1000));

      expect(markReadMessages(postMessage)).toEqual([]);
    });

    it('marks a highlighted row read', () => {
      const {container, postMessage} = renderWithPostMessage(
        <ActivityList highlightedThreadId={1} />
      );

      simulateScrollingIntoView(container);
      act(() => jest.advanceTimersByTime(1000));

      expect(markReadMessages(postMessage)).toHaveLength(1);
    });
  });
});
