import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import {useFakeTranslations} from 'pageflow/testHelpers';

import {ThreadList} from 'review/ThreadList';
import {renderWithReviewState} from 'testHelpers/renderWithReviewState';

describe('ThreadList', () => {
  useFakeTranslations({
    'pageflow_scrolled.review.reply_count.one': '1 reply',
    'pageflow_scrolled.review.reply_count.other': '%{count} replies',
    'pageflow_scrolled.review.add_comment_placeholder': 'Add a comment...',
    'pageflow_scrolled.review.new_topic': 'New topic',
    'pageflow_scrolled.review.cancel': 'Cancel',
    'pageflow_scrolled.review.reply_placeholder': 'Reply...',
    'pageflow_scrolled.review.send': 'Send',
    'pageflow_scrolled.review.enter_for_new_line': 'Enter for new line',
    'pageflow_scrolled.review.toggle_replies': 'Toggle replies',
    'pageflow_scrolled.review.resolve': 'Mark as resolved',
    'pageflow_scrolled.review.unresolve': 'Mark as unresolved',
    'pageflow_scrolled.review.resolved_count.one': '1 resolved',
    'pageflow_scrolled.review.resolved_count.other': '%{count} resolved'
  });
  it('displays comments of threads for subject', () => {
    const {getByText} = renderWithReviewState(
      <ThreadList subjectType="ContentElement" subjectId={10} />,
      {
        commentThreads: [
          {id: 1, subjectType: 'ContentElement', subjectId: 10, comments: [
            {id: 10, body: 'Looks good', creatorName: 'Bob', creatorId: 2}
          ]}
        ]
      }
    );

    expect(getByText('Bob')).toBeInTheDocument();
    expect(getByText('Looks good')).toBeInTheDocument();
  });

  it('only displays threads for given subject', () => {
    const {getByText, queryByText} = renderWithReviewState(
      <ThreadList subjectType="ContentElement" subjectId={10} />,
      {
        commentThreads: [
          {id: 1, subjectType: 'ContentElement', subjectId: 10, comments: [
            {id: 10, body: 'Matching', creatorName: 'Bob', creatorId: 2}
          ]},
          {id: 2, subjectType: 'ContentElement', subjectId: 20, comments: [
            {id: 20, body: 'Other element', creatorName: 'Alice', creatorId: 1}
          ]},
          {id: 3, subjectType: 'Section', subjectId: 10, comments: [
            {id: 30, body: 'Other type', creatorName: 'Eve', creatorId: 3}
          ]}
        ]
      }
    );

    expect(getByText('Matching')).toBeInTheDocument();
    expect(queryByText('Other element')).not.toBeInTheDocument();
    expect(queryByText('Other type')).not.toBeInTheDocument();
  });

  it('only displays threads matching subjectRange when provided', () => {
    const subjectRange = {anchor: {path: [0, 0], offset: 5}, focus: {path: [0, 0], offset: 12}};

    const {getByText, queryByText} = renderWithReviewState(
      <ThreadList subjectType="ContentElement" subjectId={10} subjectRange={subjectRange} />,
      {
        commentThreads: [
          {id: 1, subjectType: 'ContentElement', subjectId: 10, subjectRange, comments: [
            {id: 10, body: 'Matching range', creatorName: 'Bob', creatorId: 2}
          ]},
          {id: 2, subjectType: 'ContentElement', subjectId: 10, comments: [
            {id: 20, body: 'No range', creatorName: 'Alice', creatorId: 1}
          ]},
          {id: 3, subjectType: 'ContentElement', subjectId: 10,
           subjectRange: {anchor: {path: [1, 0], offset: 0}, focus: {path: [1, 0], offset: 5}},
           comments: [
            {id: 30, body: 'Different range', creatorName: 'Eve', creatorId: 3}
          ]}
        ]
      }
    );

    expect(getByText('Matching range')).toBeInTheDocument();
    expect(queryByText('No range')).not.toBeInTheDocument();
    expect(queryByText('Different range')).not.toBeInTheDocument();
  });

  it('displays formatted timestamp', () => {
    const {getByText} = renderWithReviewState(
      <ThreadList subjectType="ContentElement" subjectId={10} />,
      {
        commentThreads: [
          {id: 1, subjectType: 'ContentElement', subjectId: 10, comments: [
            {id: 10, body: 'Hello', creatorName: 'Bob', creatorId: 2,
             createdAt: '2026-03-15T14:30:00Z'}
          ]}
        ]
      }
    );

    expect(getByText('Mar 15')).toBeInTheDocument();
  });

  it('displays avatar with initial', () => {
    const {getByText} = renderWithReviewState(
      <ThreadList subjectType="ContentElement" subjectId={10} />,
      {
        commentThreads: [
          {id: 1, subjectType: 'ContentElement', subjectId: 10, comments: [
            {id: 10, body: 'Hello', creatorName: 'Bob', creatorId: 2}
          ]}
        ]
      }
    );

    expect(getByText('B')).toBeInTheDocument();
  });

  it('collapses threads when more than one exists', () => {
    const {queryByText} = renderWithReviewState(
      <ThreadList subjectType="ContentElement" subjectId={10} />,
      {
        commentThreads: [
          {id: 1, subjectType: 'ContentElement', subjectId: 10, comments: [
            {id: 10, body: 'First comment', creatorName: 'Bob', creatorId: 2},
            {id: 11, body: 'First reply', creatorName: 'Alice', creatorId: 1}
          ]},
          {id: 2, subjectType: 'ContentElement', subjectId: 10, comments: [
            {id: 20, body: 'Second comment', creatorName: 'Eve', creatorId: 3},
            {id: 21, body: 'Second reply', creatorName: 'Bob', creatorId: 2}
          ]}
        ]
      }
    );

    expect(queryByText('First comment')).toBeInTheDocument();
    expect(queryByText('First reply')).not.toBeInTheDocument();
    expect(queryByText('Second comment')).toBeInTheDocument();
    expect(queryByText('Second reply')).not.toBeInTheDocument();
  });

  it('does not collapse single thread', () => {
    const {getByText} = renderWithReviewState(
      <ThreadList subjectType="ContentElement" subjectId={10} />,
      {
        commentThreads: [
          {id: 1, subjectType: 'ContentElement', subjectId: 10, comments: [
            {id: 10, body: 'First comment', creatorName: 'Bob', creatorId: 2},
            {id: 11, body: 'A reply', creatorName: 'Alice', creatorId: 1}
          ]}
        ]
      }
    );

    expect(getByText('First comment')).toBeInTheDocument();
    expect(getByText('A reply')).toBeInTheDocument();
  });

  it('shows avatar stack of reply authors when collapsed', () => {
    const {getAllByText} = renderWithReviewState(
      <ThreadList subjectType="ContentElement" subjectId={10} />,
      {
        commentThreads: [
          {id: 1, subjectType: 'ContentElement', subjectId: 10, comments: [
            {id: 10, body: 'Start', creatorName: 'Bob', creatorId: 2},
            {id: 11, body: 'Reply 1', creatorName: 'Alice', creatorId: 1},
            {id: 12, body: 'Reply 2', creatorName: 'Eve', creatorId: 3}
          ]},
          {id: 2, subjectType: 'ContentElement', subjectId: 10, comments: [
            {id: 20, body: 'Other', creatorName: 'Dan', creatorId: 4}
          ]}
        ]
      }
    );

    expect(getAllByText('A')).toHaveLength(1);
    expect(getAllByText('E')).toHaveLength(1);
  });

  it('shows chevron toggle on threads with replies', () => {
    const {getAllByRole} = renderWithReviewState(
      <ThreadList subjectType="ContentElement" subjectId={10} />,
      {
        commentThreads: [
          {id: 1, subjectType: 'ContentElement', subjectId: 10, comments: [
            {id: 10, body: 'Topic', creatorName: 'Bob', creatorId: 2},
            {id: 11, body: 'Reply', creatorName: 'Alice', creatorId: 1}
          ]},
          {id: 2, subjectType: 'ContentElement', subjectId: 10, comments: [
            {id: 20, body: 'No replies', creatorName: 'Eve', creatorId: 3}
          ]}
        ]
      }
    );

    expect(getAllByRole('button', {name: 'Toggle replies'})).toHaveLength(1);
  });

  it('expands collapsed thread via chevron', async () => {
    const user = userEvent.setup();
    const {getByRole, getByText, queryByText} = renderWithReviewState(
      <ThreadList subjectType="ContentElement" subjectId={10} />,
      {
        commentThreads: [
          {id: 1, subjectType: 'ContentElement', subjectId: 10, comments: [
            {id: 10, body: 'First comment', creatorName: 'Bob', creatorId: 2},
            {id: 11, body: 'Hidden reply', creatorName: 'Alice', creatorId: 1}
          ]},
          {id: 2, subjectType: 'ContentElement', subjectId: 10, comments: [
            {id: 20, body: 'Other thread', creatorName: 'Eve', creatorId: 3}
          ]}
        ]
      }
    );

    expect(queryByText('Hidden reply')).not.toBeInTheDocument();

    await user.click(getByRole('button', {name: 'Toggle replies'}));

    expect(getByText('Hidden reply')).toBeInTheDocument();
  });

  it('expands collapsed thread via reply count button', async () => {
    const user = userEvent.setup();
    const {getByText, queryByText} = renderWithReviewState(
      <ThreadList subjectType="ContentElement" subjectId={10} />,
      {
        commentThreads: [
          {id: 1, subjectType: 'ContentElement', subjectId: 10, comments: [
            {id: 10, body: 'First comment', creatorName: 'Bob', creatorId: 2},
            {id: 11, body: 'Hidden reply', creatorName: 'Alice', creatorId: 1}
          ]},
          {id: 2, subjectType: 'ContentElement', subjectId: 10, comments: [
            {id: 20, body: 'Other thread', creatorName: 'Eve', creatorId: 3}
          ]}
        ]
      }
    );

    expect(queryByText('Hidden reply')).not.toBeInTheDocument();

    await user.click(getByText('1 reply'));

    expect(getByText('Hidden reply')).toBeInTheDocument();
  });

  it('displays multiple threads', () => {
    const {getByText} = renderWithReviewState(
      <ThreadList subjectType="ContentElement" subjectId={10} />,
      {
        commentThreads: [
          {id: 1, subjectType: 'ContentElement', subjectId: 10, comments: [
            {id: 10, body: 'First thread', creatorName: 'Bob', creatorId: 2}
          ]},
          {id: 2, subjectType: 'ContentElement', subjectId: 10, comments: [
            {id: 20, body: 'Second thread', creatorName: 'Alice', creatorId: 1}
          ]}
        ]
      }
    );

    expect(getByText('First thread')).toBeInTheDocument();
    expect(getByText('Second thread')).toBeInTheDocument();
  });

  it('posts create thread message on form submit', async () => {
    const user = userEvent.setup();
    const postMessage = jest.spyOn(window.top, 'postMessage').mockImplementation(() => {});

    const {getByPlaceholderText, getByRole} = renderWithReviewState(
      <ThreadList subjectType="ContentElement" subjectId={10} />
    );

    await user.type(getByPlaceholderText('Add a comment...'), 'New thread');
    await user.click(getByRole('button', {name: 'Send'}));

    expect(postMessage).toHaveBeenCalledWith(
      {
        type: 'CREATE_COMMENT_THREAD',
        payload: {
          subjectType: 'ContentElement',
          subjectId: 10,
          body: 'New thread'
        }
      },
      window.location.origin
    );

    postMessage.mockRestore();
  });

  it('includes subjectRange in create thread message', async () => {
    const user = userEvent.setup();
    const postMessage = jest.spyOn(window.top, 'postMessage').mockImplementation(() => {});
    const subjectRange = {anchor: {path: [0, 0], offset: 5}, focus: {path: [0, 0], offset: 12}};

    const {getByPlaceholderText, getByRole} = renderWithReviewState(
      <ThreadList subjectType="ContentElement" subjectId={10} subjectRange={subjectRange} />
    );

    await user.type(getByPlaceholderText('Add a comment...'), 'Range comment');
    await user.click(getByRole('button', {name: 'Send'}));

    expect(postMessage).toHaveBeenCalledWith(
      {
        type: 'CREATE_COMMENT_THREAD',
        payload: expect.objectContaining({subjectRange})
      },
      window.location.origin
    );

    postMessage.mockRestore();
  });

  it('shows new topic form automatically when no threads exist', () => {
    const {getByPlaceholderText} = renderWithReviewState(
      <ThreadList subjectType="ContentElement" subjectId={10} />
    );

    expect(getByPlaceholderText('Add a comment...')).toBeInTheDocument();
  });

  it('shows new topic form when showNewForm is true', () => {
    const {getByPlaceholderText} = renderWithReviewState(
      <ThreadList subjectType="ContentElement" subjectId={10} showNewForm={true} />,
      {
        commentThreads: [
          {id: 1, subjectType: 'ContentElement', subjectId: 10, comments: [
            {id: 10, body: 'Existing', creatorName: 'Bob', creatorId: 2}
          ]}
        ]
      }
    );

    expect(getByPlaceholderText('Add a comment...')).toBeInTheDocument();
  });

  it('does not auto show new topic form when showNewForm is false', () => {
    const {queryByPlaceholderText} = renderWithReviewState(
      <ThreadList subjectType="ContentElement" subjectId={10} showNewForm={false} />
    );

    expect(queryByPlaceholderText('Add a comment...')).not.toBeInTheDocument();
  });

  it('hides new topic button when hideNewTopicButton is true', () => {
    const {queryByRole} = renderWithReviewState(
      <ThreadList subjectType="ContentElement" subjectId={10} hideNewTopicButton={true} />,
      {
        commentThreads: [
          {id: 1, subjectType: 'ContentElement', subjectId: 10, comments: [
            {id: 10, body: 'Existing', creatorName: 'Bob', creatorId: 2}
          ]}
        ]
      }
    );

    expect(queryByRole('button', {name: 'New topic'})).not.toBeInTheDocument();
  });

  it('hides new topic form behind button when threads exist', () => {
    const {queryByPlaceholderText, getByRole} = renderWithReviewState(
      <ThreadList subjectType="ContentElement" subjectId={10} />,
      {
        commentThreads: [
          {id: 1, subjectType: 'ContentElement', subjectId: 10, comments: [
            {id: 10, body: 'Existing', creatorName: 'Bob', creatorId: 2}
          ]}
        ]
      }
    );

    expect(queryByPlaceholderText('Add a comment...')).not.toBeInTheDocument();
    expect(getByRole('button', {name: 'New topic'})).toBeInTheDocument();
  });

  it('shows form when New topic button is clicked', async () => {
    const user = userEvent.setup();

    const {getByPlaceholderText, getByRole} = renderWithReviewState(
      <ThreadList subjectType="ContentElement" subjectId={10} />,
      {
        commentThreads: [
          {id: 1, subjectType: 'ContentElement', subjectId: 10, comments: [
            {id: 10, body: 'Existing', creatorName: 'Bob', creatorId: 2}
          ]}
        ]
      }
    );

    await user.click(getByRole('button', {name: 'New topic'}));

    expect(getByPlaceholderText('Add a comment...')).toBeInTheDocument();
  });

  it('hides form when cancel is clicked', async () => {
    const user = userEvent.setup();

    const {getByRole, queryByPlaceholderText} = renderWithReviewState(
      <ThreadList subjectType="ContentElement" subjectId={10} />,
      {
        commentThreads: [
          {id: 1, subjectType: 'ContentElement', subjectId: 10, comments: [
            {id: 10, body: 'Existing', creatorName: 'Bob', creatorId: 2}
          ]}
        ]
      }
    );

    await user.click(getByRole('button', {name: 'New topic'}));
    await user.click(getByRole('button', {name: 'Cancel'}));

    expect(queryByPlaceholderText('Add a comment...')).not.toBeInTheDocument();
    expect(getByRole('button', {name: 'New topic'})).toBeInTheDocument();
  });

  it('posts create comment message when replying to thread', async () => {
    const user = userEvent.setup();
    const postMessage = jest.spyOn(window.top, 'postMessage').mockImplementation(() => {});

    const {getByPlaceholderText, getByRole} = renderWithReviewState(
      <ThreadList subjectType="ContentElement" subjectId={10} />,
      {
        commentThreads: [
          {id: 1, subjectType: 'ContentElement', subjectId: 10, comments: [
            {id: 10, body: 'Start', creatorName: 'Bob', creatorId: 2}
          ]}
        ]
      }
    );

    await user.type(getByPlaceholderText('Reply...'), 'My reply');
    await user.click(getByRole('button', {name: 'Send'}));

    expect(postMessage).toHaveBeenCalledWith(
      {
        type: 'CREATE_COMMENT',
        payload: {threadId: 1, body: 'My reply'}
      },
      window.location.origin
    );

    postMessage.mockRestore();
  });

  it('hides reply submit button when textarea is empty', () => {
    const {queryByRole, getByPlaceholderText} = renderWithReviewState(
      <ThreadList subjectType="ContentElement" subjectId={10} />,
      {
        commentThreads: [
          {id: 1, subjectType: 'ContentElement', subjectId: 10, comments: [
            {id: 10, body: 'Start', creatorName: 'Bob', creatorId: 2}
          ]}
        ]
      }
    );

    expect(getByPlaceholderText('Reply...')).toBeInTheDocument();
    expect(queryByRole('button', {name: 'Send'})).not.toBeInTheDocument();
  });

  it('shows reply submit button when text is entered', async () => {
    const user = userEvent.setup();

    const {getByRole, getByPlaceholderText} = renderWithReviewState(
      <ThreadList subjectType="ContentElement" subjectId={10} />,
      {
        commentThreads: [
          {id: 1, subjectType: 'ContentElement', subjectId: 10, comments: [
            {id: 10, body: 'Start', creatorName: 'Bob', creatorId: 2}
          ]}
        ]
      }
    );

    await user.type(getByPlaceholderText('Reply...'), 'Some text');

    expect(getByRole('button', {name: 'Send'})).toBeInTheDocument();
  });

  it('hides resolved threads and shows resolved count pill', () => {
    const {queryByText, getByText} = renderWithReviewState(
      <ThreadList subjectType="ContentElement" subjectId={10} />,
      {
        commentThreads: [
          {id: 1, subjectType: 'ContentElement', subjectId: 10,
           resolvedAt: '2026-04-09T10:00:00Z',
           comments: [{id: 10, body: 'Resolved thread', creatorName: 'Bob', creatorId: 2}]},
          {id: 2, subjectType: 'ContentElement', subjectId: 10,
           resolvedAt: null,
           comments: [{id: 20, body: 'Active thread', creatorName: 'Alice', creatorId: 1}]}
        ]
      }
    );

    expect(getByText('Active thread')).toBeInTheDocument();
    expect(queryByText('Resolved thread')).not.toBeInTheDocument();
    expect(getByText('1 resolved')).toBeInTheDocument();
  });

  it('toggles resolved threads when pill is clicked', async () => {
    const user = userEvent.setup();

    const {getByText, queryByText} = renderWithReviewState(
      <ThreadList subjectType="ContentElement" subjectId={10} />,
      {
        commentThreads: [
          {id: 1, subjectType: 'ContentElement', subjectId: 10,
           resolvedAt: '2026-04-09T10:00:00Z',
           comments: [{id: 10, body: 'Resolved thread', creatorName: 'Bob', creatorId: 2}]},
          {id: 2, subjectType: 'ContentElement', subjectId: 10,
           resolvedAt: null,
           comments: [{id: 20, body: 'Active thread', creatorName: 'Alice', creatorId: 1}]}
        ]
      }
    );

    await user.click(getByText('1 resolved'));
    expect(getByText('Resolved thread')).toBeInTheDocument();
    expect(getByText('1 resolved')).toBeInTheDocument();

    await user.click(getByText('1 resolved'));
    expect(queryByText('Resolved thread')).not.toBeInTheDocument();
  });

  it('posts resolve message when resolve button is clicked', async () => {
    const user = userEvent.setup();
    const postMessage = jest.spyOn(window.top, 'postMessage').mockImplementation(() => {});

    const {getByText} = renderWithReviewState(
      <ThreadList subjectType="ContentElement" subjectId={10} />,
      {
        commentThreads: [
          {id: 1, subjectType: 'ContentElement', subjectId: 10,
           resolvedAt: null,
           comments: [{id: 10, body: 'Open thread', creatorName: 'Bob', creatorId: 2}]}
        ]
      }
    );

    await user.click(getByText('Mark as resolved'));

    expect(postMessage).toHaveBeenCalledWith(
      {type: 'UPDATE_THREAD', payload: {threadId: 1, resolved: true}},
      window.location.origin
    );

    postMessage.mockRestore();
  });

  it('does not show resolve button on collapsed threads with replies', () => {
    const {queryByText} = renderWithReviewState(
      <ThreadList subjectType="ContentElement" subjectId={10} />,
      {
        commentThreads: [
          {id: 1, subjectType: 'ContentElement', subjectId: 10,
           resolvedAt: null,
           comments: [
             {id: 10, body: 'First thread', creatorName: 'Bob', creatorId: 2},
             {id: 11, body: 'Reply', creatorName: 'Alice', creatorId: 1}
           ]},
          {id: 2, subjectType: 'ContentElement', subjectId: 10,
           resolvedAt: null,
           comments: [
             {id: 20, body: 'Second thread', creatorName: 'Alice', creatorId: 1},
             {id: 21, body: 'Reply', creatorName: 'Bob', creatorId: 2}
           ]}
        ]
      }
    );

    expect(queryByText('Mark as resolved')).not.toBeInTheDocument();
  });

  it('does not show reply form on resolved threads', async () => {
    const user = userEvent.setup();

    const {queryByPlaceholderText, getByText} = renderWithReviewState(
      <ThreadList subjectType="ContentElement" subjectId={10} />,
      {
        commentThreads: [
          {id: 1, subjectType: 'ContentElement', subjectId: 10,
           resolvedAt: null,
           comments: [{id: 10, body: 'Active thread', creatorName: 'Bob', creatorId: 2}]},
          {id: 2, subjectType: 'ContentElement', subjectId: 10,
           resolvedAt: '2026-04-09T10:00:00Z',
           comments: [{id: 20, body: 'Resolved thread', creatorName: 'Alice', creatorId: 1}]}
        ]
      }
    );

    await user.click(getByText('1 resolved'));

    const replyFields = queryByPlaceholderText('Reply...');
    expect(replyFields).toBeInTheDocument();

    expect(getByText('Resolved thread')).toBeInTheDocument();
    const resolvedThread = getByText('Resolved thread').closest('[class*="thread"]');
    expect(resolvedThread.querySelector('textarea[placeholder="Reply..."]')).toBeNull();
  });

  it('shows reply form in collapsed thread without replies', () => {
    const {getAllByPlaceholderText} = renderWithReviewState(
      <ThreadList subjectType="ContentElement" subjectId={10} />,
      {
        commentThreads: [
          {id: 1, subjectType: 'ContentElement', subjectId: 10, comments: [
            {id: 10, body: 'First topic', creatorName: 'Bob', creatorId: 2}
          ]},
          {id: 2, subjectType: 'ContentElement', subjectId: 10, comments: [
            {id: 20, body: 'Second topic', creatorName: 'Alice', creatorId: 1}
          ]}
        ]
      }
    );

    expect(getAllByPlaceholderText('Reply...')).toHaveLength(2);
  });
});
