import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import {act, waitFor} from '@testing-library/react';
import {useFakeTranslations} from 'pageflow/testHelpers';

import {ThreadList} from 'review/ThreadList';
import {
  postReviewStateDraftsChangeMessage,
  postReviewStateThreadChangeMessage
} from 'review/postMessage';
import {review} from 'review/api';
import {ScrollHighlightedThreadIntoViewProvider} from 'review/scrollHighlightedThreadIntoView';
import {renderWithReviewState} from 'support/renderWithReviewState';

// ThreadList resolves its threads from the located threads by subject, so
// the subject must exist in the entry structure.
const seed = {
  sections: [{id: 1, permaId: 1}],
  contentElements: [{id: 1, permaId: 10, sectionId: 1, typeName: 'textBlock'}]
};

function renderThreadList(ui, options = {}) {
  return renderWithReviewState(ui, {seed, ...options});
}

function postDraftsChange(drafts) {
  act(() => postReviewStateDraftsChangeMessage(window, drafts));
}

function postThreadChange(thread) {
  act(() => postReviewStateThreadChangeMessage(window, thread));
}

describe('ThreadList', () => {
  useFakeTranslations({
    'pageflow_scrolled.review.reply_count.one': '1 reply',
    'pageflow_scrolled.review.reply_count.other': '%{count} replies',
    'pageflow_scrolled.review.add_comment_placeholder': 'Add a comment...',
    'pageflow_scrolled.review.new_topic': 'New topic',
    'pageflow_scrolled.review.reply_placeholder': 'Reply...',
    'pageflow_scrolled.review.send': 'Send',
    'pageflow_scrolled.review.enter_for_new_line': 'Enter for new line',
    'pageflow_scrolled.review.resolve': 'Mark as resolved',
    'pageflow_scrolled.review.unresolve': 'Mark as unresolved',
    'pageflow_scrolled.review.resolved_count.one': '1 resolved',
    'pageflow_scrolled.review.resolved_count.other': '%{count} resolved',
    'pageflow_scrolled.review.no_threads_yet': 'No comments yet',
    'pageflow_scrolled.review.refers_to_deleted_element': 'Refers to a deleted element'
  });

  afterEach(() => {
    review.contentElementTypes.types = {};
  });

  it('displays comments of threads for the subject', () => {
    const {getByText} = renderThreadList(
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

  it('only displays threads for the given subject', () => {
    const {getByText, queryByText} = renderThreadList(
      <ThreadList subjectType="ContentElement" subjectId={10} />,
      {
        commentThreads: [
          {id: 1, subjectType: 'ContentElement', subjectId: 10, comments: [
            {id: 10, body: 'Matching', creatorName: 'Bob', creatorId: 2}
          ]},
          {id: 3, subjectType: 'Section', subjectId: 1, comments: [
            {id: 30, body: 'Other type', creatorName: 'Eve', creatorId: 3}
          ]}
        ]
      }
    );

    expect(getByText('Matching')).toBeInTheDocument();
    expect(queryByText('Other type')).not.toBeInTheDocument();
  });

  it('applies filter prop to narrow threads', () => {
    const {getByText, queryByText} = renderThreadList(
      <ThreadList subjectType="ContentElement"
                  subjectId={10}
                  filter={thread => thread.id === 1} />,
      {
        commentThreads: [
          {id: 1, subjectType: 'ContentElement', subjectId: 10, comments: [
            {id: 10, body: 'Kept', creatorName: 'Bob', creatorId: 2}
          ]},
          {id: 2, subjectType: 'ContentElement', subjectId: 10, comments: [
            {id: 20, body: 'Filtered out', creatorName: 'Alice', creatorId: 1}
          ]}
        ]
      }
    );

    expect(getByText('Kept')).toBeInTheDocument();
    expect(queryByText('Filtered out')).not.toBeInTheDocument();
  });

  it('marks the thread matching highlightedThreadId with aria-current', () => {
    const {container, getByText} = renderThreadList(
      <ThreadList subjectType="ContentElement" subjectId={10} highlightedThreadId={2} />,
      {
        commentThreads: [
          {id: 1, subjectType: 'ContentElement', subjectId: 10, comments: [
            {id: 10, body: 'first', creatorName: 'Alice', creatorId: 1}
          ]},
          {id: 2, subjectType: 'ContentElement', subjectId: 10, comments: [
            {id: 20, body: 'second', creatorName: 'Bob', creatorId: 2}
          ]}
        ]
      }
    );

    const highlighted = container.querySelector('[aria-current="true"]');
    expect(highlighted).toContainElement(getByText('second'));
    expect(highlighted).not.toContainElement(getByText('first'));
  });

  it('highlights every thread when highlightedThreadId is an array of ids', () => {
    const {container, getByText} = renderThreadList(
      <ThreadList subjectType="ContentElement" subjectId={10} highlightedThreadId={[1, 2]} />,
      {
        commentThreads: [
          {id: 1, subjectType: 'ContentElement', subjectId: 10, comments: [
            {id: 10, body: 'first', creatorName: 'Alice', creatorId: 1}
          ]},
          {id: 2, subjectType: 'ContentElement', subjectId: 10, comments: [
            {id: 20, body: 'second', creatorName: 'Bob', creatorId: 2}
          ]},
          {id: 3, subjectType: 'ContentElement', subjectId: 10, comments: [
            {id: 30, body: 'third', creatorName: 'Eve', creatorId: 3}
          ]}
        ]
      }
    );

    const highlighted = container.querySelectorAll('[aria-current="true"]');
    expect(highlighted).toHaveLength(2);
    expect(getByText('first').closest('[aria-current="true"]')).not.toBeNull();
    expect(getByText('second').closest('[aria-current="true"]')).not.toBeNull();
    expect(getByText('third').closest('[aria-current="true"]')).toBeNull();
  });

  it('fires onThreadClick with the clicked thread', async () => {
    const user = userEvent.setup();
    const onThreadClick = jest.fn();
    const {getByText} = renderThreadList(
      <ThreadList subjectType="ContentElement" subjectId={10} onThreadClick={onThreadClick} />,
      {
        commentThreads: [
          {id: 7, subjectType: 'ContentElement', subjectId: 10, comments: [
            {id: 70, body: 'click me', creatorName: 'Bob', creatorId: 2}
          ]}
        ]
      }
    );

    await user.click(getByText('click me'));

    expect(onThreadClick).toHaveBeenCalledWith(expect.objectContaining({id: 7}));
  });

  it('scrolls the highlighted thread into view within the scroll context', () => {
    const {getByText} = renderThreadList(
      <ScrollHighlightedThreadIntoViewProvider>
        <ThreadList subjectType="ContentElement" subjectId={10} highlightedThreadId={2} />
      </ScrollHighlightedThreadIntoViewProvider>,
      {
        commentThreads: [
          {id: 1, subjectType: 'ContentElement', subjectId: 10, comments: [
            {id: 10, body: 'first', creatorName: 'Alice', creatorId: 1}
          ]},
          {id: 2, subjectType: 'ContentElement', subjectId: 10, comments: [
            {id: 20, body: 'second', creatorName: 'Bob', creatorId: 2}
          ]}
        ]
      }
    );

    const scrollIntoView = Element.prototype.scrollIntoView;
    expect(scrollIntoView).toHaveBeenCalled();
    expect(scrollIntoView.mock.instances[0])
      .toBe(getByText('second').closest('[aria-current="true"]'));
  });

  it('does not scroll the highlighted thread into view outside the scroll context', () => {
    renderThreadList(
      <ThreadList subjectType="ContentElement" subjectId={10} highlightedThreadId={2} />,
      {
        commentThreads: [
          {id: 1, subjectType: 'ContentElement', subjectId: 10, comments: [
            {id: 10, body: 'first', creatorName: 'Alice', creatorId: 1}
          ]},
          {id: 2, subjectType: 'ContentElement', subjectId: 10, comments: [
            {id: 20, body: 'second', creatorName: 'Bob', creatorId: 2}
          ]}
        ]
      }
    );

    expect(Element.prototype.scrollIntoView).not.toHaveBeenCalled();
  });

  it('hides reply form on non-highlighted threads when restrictInteractionsToHighlighted', () => {
    const {getByText, queryAllByPlaceholderText} = renderThreadList(
      <ThreadList subjectType="ContentElement"
                  subjectId={10}
                  highlightedThreadId={2}
                  restrictInteractionsToHighlighted />,
      {
        commentThreads: [
          {id: 1, subjectType: 'ContentElement', subjectId: 10, comments: [
            {id: 10, body: 'first', creatorName: 'Alice', creatorId: 1}
          ]},
          {id: 2, subjectType: 'ContentElement', subjectId: 10, comments: [
            {id: 20, body: 'second', creatorName: 'Bob', creatorId: 2}
          ]}
        ]
      }
    );

    const replyInputs = queryAllByPlaceholderText('Reply...');
    expect(replyInputs).toHaveLength(1);
    expect(getByText('second').closest('[aria-current="true"]'))
      .toContainElement(replyInputs[0]);
  });

  it('hides resolve button on non-highlighted threads when restrictInteractionsToHighlighted', () => {
    const {queryAllByText} = renderThreadList(
      <ThreadList subjectType="ContentElement"
                  subjectId={10}
                  highlightedThreadId={2}
                  restrictInteractionsToHighlighted />,
      {
        commentThreads: [
          {id: 1, subjectType: 'ContentElement', subjectId: 10, comments: [
            {id: 10, body: 'first', creatorName: 'Alice', creatorId: 1}
          ]},
          {id: 2, subjectType: 'ContentElement', subjectId: 10, comments: [
            {id: 20, body: 'second', creatorName: 'Bob', creatorId: 2}
          ]}
        ]
      }
    );

    expect(queryAllByText('Mark as resolved')).toHaveLength(1);
  });

  it('applies filter prop to resolved threads', async () => {
    const user = userEvent.setup();
    const {getByText, queryByText} = renderThreadList(
      <ThreadList subjectType="ContentElement"
                  subjectId={10}
                  filter={thread => thread.id === 1} />,
      {
        commentThreads: [
          {id: 1, subjectType: 'ContentElement', subjectId: 10,
           resolvedAt: '2026-04-09T10:00:00Z',
           comments: [{id: 10, body: 'Kept resolved', creatorName: 'Bob', creatorId: 2}]},
          {id: 2, subjectType: 'ContentElement', subjectId: 10,
           resolvedAt: '2026-04-09T10:00:00Z',
           comments: [{id: 20, body: 'Filtered resolved', creatorName: 'Alice', creatorId: 1}]}
        ]
      }
    );

    await user.click(getByText('1 resolved'));

    expect(getByText('Kept resolved')).toBeInTheDocument();
    expect(queryByText('Filtered resolved')).not.toBeInTheDocument();
  });

  it('displays formatted timestamp', () => {
    const {getByText} = renderThreadList(
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
    const {getByText} = renderThreadList(
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
    const {queryByText} = renderThreadList(
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

  it('expands the only thread', () => {
    const {getByText} = renderThreadList(
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

  it('keeps the only thread collapsed when startCollapsed is set', () => {
    const {queryByText} = renderThreadList(
      <ThreadList subjectType="ContentElement" subjectId={10} startCollapsed />,
      {
        commentThreads: [
          {id: 1, subjectType: 'ContentElement', subjectId: 10, comments: [
            {id: 10, body: 'First comment', creatorName: 'Bob', creatorId: 2},
            {id: 11, body: 'A reply', creatorName: 'Alice', creatorId: 1}
          ]}
        ]
      }
    );

    expect(queryByText('First comment')).toBeInTheDocument();
    expect(queryByText('A reply')).not.toBeInTheDocument();
  });

  it('collapses the only thread from its reply count', async () => {
    const user = userEvent.setup();

    const {getByRole, queryByText} = renderThreadList(
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

    await user.click(getByRole('button', {name: /1 reply/}));

    expect(queryByText('A reply')).not.toBeInTheDocument();
  });

  it('collapses an expanded thread when another one is expanded', async () => {
    const user = userEvent.setup();

    const {getAllByRole, queryByText} = renderThreadList(
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

    await user.click(getAllByRole('button', {name: /1 reply/})[0]);
    await user.click(getAllByRole('button', {name: /1 reply/})[1]);

    expect(queryByText('First reply')).not.toBeInTheDocument();
    expect(queryByText('Second reply')).toBeInTheDocument();
  });

  describe('orphaned threads', () => {
    it('shows a section\'s orphaned threads on top with a deleted-element hint', () => {
      const {getByText} = renderThreadList(
        <ThreadList subjectType="Section" subjectId={1} hideNewTopicButton />,
        {
          commentThreads: [
            {id: 1, subjectType: 'Section', subjectId: 1, comments: [
              {id: 10, body: 'On the section', creatorName: 'Bob', creatorId: 2}
            ]},
            {id: 2, subjectType: 'ContentElement', subjectId: 99999, sectionPermaId: 1, comments: [
              {id: 20, body: 'On a deleted element', creatorName: 'Alice', creatorId: 1}
            ]}
          ]
        }
      );

      const orphan = getByText('On a deleted element');
      const sectionThread = getByText('On the section');

      expect(getByText('Refers to a deleted element')).toBeInTheDocument();
      expect(orphan.compareDocumentPosition(sectionThread) & Node.DOCUMENT_POSITION_FOLLOWING)
        .toBeTruthy();
    });

    it('does not add the hint to normal subject threads', () => {
      const {getByText, queryByText} = renderThreadList(
        <ThreadList subjectType="ContentElement" subjectId={10} hideNewTopicButton />,
        {
          commentThreads: [
            {id: 1, subjectType: 'ContentElement', subjectId: 10, comments: [
              {id: 10, body: 'On the element', creatorName: 'Bob', creatorId: 2}
            ]}
          ]
        }
      );

      expect(getByText('On the element')).toBeInTheDocument();
      expect(queryByText('Refers to a deleted element')).not.toBeInTheDocument();
    });
  });

  describe('new thread form', () => {
    it('posts create thread message on form submit', async () => {
      const user = userEvent.setup();
      const postMessage = jest.spyOn(window.top, 'postMessage').mockImplementation(() => {});

      const {getByPlaceholderText, getByRole} = renderThreadList(
        <ThreadList subjectType="ContentElement" subjectId={10} />
      );

      await user.type(getByPlaceholderText('Add a comment...'), 'New thread');
      await user.click(getByRole('button', {name: 'Send'}));

      expect(postMessage).toHaveBeenCalledWith(
        {
          type: 'CREATE_COMMENT_THREAD',
          payload: expect.objectContaining({
            subjectType: 'ContentElement',
            subjectId: 10,
            body: 'New thread'
          })
        },
        window.location.origin
      );

      postMessage.mockRestore();
    });

    it('includes the parent section perma id in create thread message', async () => {
      const user = userEvent.setup();
      const postMessage = jest.spyOn(window.top, 'postMessage').mockImplementation(() => {});

      const {getByPlaceholderText, getByRole} = renderThreadList(
        <ThreadList subjectType="ContentElement" subjectId={10} />
      );

      await user.type(getByPlaceholderText('Add a comment...'), 'New thread');
      await user.click(getByRole('button', {name: 'Send'}));

      expect(postMessage).toHaveBeenCalledWith(
        {
          type: 'CREATE_COMMENT_THREAD',
          payload: expect.objectContaining({
            subjectType: 'ContentElement',
            subjectId: 10,
            sectionPermaId: 1
          })
        },
        window.location.origin
      );

      postMessage.mockRestore();
    });

    it('includes the quote of the selected range in create thread message', async () => {
      const user = userEvent.setup();
      const postMessage = jest.spyOn(window.top, 'postMessage').mockImplementation(() => {});

      review.contentElementTypes.register('textBlock', {
        extractQuote: configuration => configuration.value
      });

      const {getByPlaceholderText, getByRole} = renderWithReviewState(
        <ThreadList subjectType="ContentElement"
                    subjectId={10}
                    subjectRange={{anchor: {path: [0, 0], offset: 0},
                                   focus: {path: [0, 0], offset: 6}}} />,
        {
          seed: {
            sections: [{id: 1, permaId: 1}],
            contentElements: [{
              id: 1, permaId: 10, sectionId: 1, typeName: 'textBlock',
              configuration: {value: 'Quoted text'}
            }]
          }
        }
      );

      await user.type(getByPlaceholderText('Add a comment...'), 'New thread');
      await user.click(getByRole('button', {name: 'Send'}));

      expect(postMessage).toHaveBeenCalledWith(
        {
          type: 'CREATE_COMMENT_THREAD',
          payload: expect.objectContaining({quote: 'Quoted text'})
        },
        window.location.origin
      );

      postMessage.mockRestore();
    });

    it('sends the section perma id itself for section subjects', async () => {
      const user = userEvent.setup();
      const postMessage = jest.spyOn(window.top, 'postMessage').mockImplementation(() => {});

      const {getByPlaceholderText, getByRole} = renderThreadList(
        <ThreadList subjectType="Section" subjectId={1} />
      );

      await user.type(getByPlaceholderText('Add a comment...'), 'Section comment');
      await user.click(getByRole('button', {name: 'Send'}));

      expect(postMessage).toHaveBeenCalledWith(
        {
          type: 'CREATE_COMMENT_THREAD',
          payload: expect.objectContaining({
            subjectType: 'Section',
            subjectId: 1,
            sectionPermaId: 1
          })
        },
        window.location.origin
      );

      postMessage.mockRestore();
    });

    it('shows new topic form automatically when no threads exist', () => {
      const {getByPlaceholderText} = renderThreadList(
        <ThreadList subjectType="ContentElement" subjectId={10} />
      );

      expect(getByPlaceholderText('Add a comment...')).toBeInTheDocument();
    });

    // Whether the list starts out with a form is decided when it mounts,
    // so resolving the last thread does not invite a new one.
    it('does not open the form when the last thread becomes resolved', async () => {
      const thread = {
        id: 1,
        subjectType: 'ContentElement',
        subjectId: 10,
        comments: [{id: 10, body: 'Existing', creatorName: 'Bob', creatorId: 2}]
      };

      const {getByText, queryByPlaceholderText} = renderThreadList(
        <ThreadList subjectType="ContentElement" subjectId={10} />,
        {commentThreads: [thread]}
      );

      postThreadChange({...thread, resolvedAt: '2026-07-31'});

      await waitFor(() => expect(getByText('1 resolved')).toBeInTheDocument());
      expect(queryByPlaceholderText('Add a comment...')).toBeNull();
    });

    it('shows new topic form when showNewForm is true', () => {
      const {getByPlaceholderText} = renderThreadList(
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
      const {queryByPlaceholderText} = renderThreadList(
        <ThreadList subjectType="ContentElement" subjectId={10} showNewForm={false} />
      );

      expect(queryByPlaceholderText('Add a comment...')).not.toBeInTheDocument();
    });

    it('shows blank slate when no threads exist and showNewForm is false', () => {
      const {getByText} = renderThreadList(
        <ThreadList subjectType="ContentElement" subjectId={10} showNewForm={false} />
      );

      expect(getByText('No comments yet')).toBeInTheDocument();
    });

    it('does not show blank slate when active threads exist', () => {
      const {queryByText} = renderThreadList(
        <ThreadList subjectType="ContentElement" subjectId={10} showNewForm={false} />,
        {
          commentThreads: [
            {id: 1, subjectType: 'ContentElement', subjectId: 10, comments: [
              {id: 10, body: 'Looks good', creatorName: 'Bob', creatorId: 2}
            ]}
          ]
        }
      );

      expect(queryByText('No comments yet')).not.toBeInTheDocument();
    });

    it('hides new topic button when hideNewTopicButton is true', () => {
      const {queryByRole} = renderThreadList(
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

    it('shows form when New topic button is clicked', async () => {
      const user = userEvent.setup();

      const {getByPlaceholderText, getByRole} = renderThreadList(
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

    it('shows the form again when a draft exists for the subject', () => {
      const {getByPlaceholderText} = renderThreadList(
        <ThreadList subjectType="ContentElement" subjectId={10} />,
        {
          commentThreads: [
            {id: 1, subjectType: 'ContentElement', subjectId: 10, comments: [
              {id: 10, body: 'Existing', creatorName: 'Bob', creatorId: 2}
            ]}
          ],
          drafts: {
            'ContentElement:10': {
              subjectType: 'ContentElement', subjectId: 10, body: 'Half a thought'
            }
          }
        }
      );

      expect(getByPlaceholderText('Add a comment...')).toHaveValue('Half a thought');
    });

    it('keeps the form open while the thread is being created', () => {
      const {getByPlaceholderText} = renderThreadList(
        <ThreadList subjectType="ContentElement" subjectId={10} />,
        {
          drafts: {
            'ContentElement:10': {
              subjectType: 'ContentElement',
              subjectId: 10,
              body: 'Looks good',
              pending: true
            }
          }
        }
      );

      expect(getByPlaceholderText('Add a comment...')).toBeDisabled();
    });

    // The editor sidebar lists opt out of the form entirely, since new
    // threads are composed in a view of their own there.
    it('does not show the form for a draft when showNewForm is false', () => {
      const {queryByPlaceholderText} = renderThreadList(
        <ThreadList subjectType="ContentElement" subjectId={10} showNewForm={false} />,
        {
          drafts: {
            'ContentElement:10': {
              subjectType: 'ContentElement', subjectId: 10, body: 'Half a thought'
            }
          }
        }
      );

      expect(queryByPlaceholderText('Add a comment...')).toBeNull();
    });

    it('keeps the form open with the text on submit', async () => {
      const user = userEvent.setup();

      const {getByPlaceholderText, getByRole} = renderThreadList(
        <ThreadList subjectType="ContentElement" subjectId={10} />
      );

      await user.type(getByPlaceholderText('Add a comment...'), 'New thread');
      await user.click(getByRole('button', {name: 'Send'}));

      expect(getByPlaceholderText('Add a comment...')).toBeDisabled();
      expect(getByPlaceholderText('Add a comment...')).toHaveValue('New thread');
    });

    // Storing the text on the way out would bring back the draft the
    // session has just dropped and reopen the form.
    it('closes the form for good after the thread has been created', async () => {
      const user = userEvent.setup();
      const setDraft = jest.fn();

      const {getByPlaceholderText, queryByPlaceholderText, getByRole} = renderThreadList(
        <ThreadList subjectType="ContentElement" subjectId={10} />,
        {setDraft}
      );

      await user.type(getByPlaceholderText('Add a comment...'), 'New thread');
      await user.click(getByRole('button', {name: 'Send'}));

      postDraftsChange({
        'ContentElement:10': {
          subjectType: 'ContentElement',
          subjectId: 10,
          body: 'New thread',
          pending: true
        }
      });
      await waitFor(() =>
        expect(getByPlaceholderText('Add a comment...')).toBeDisabled()
      );
      setDraft.mockClear();

      postThreadChange({
        id: 1,
        subjectType: 'ContentElement',
        subjectId: 10,
        comments: [{id: 10, body: 'New thread', creatorName: 'Alice', creatorId: 1}]
      });
      postDraftsChange({});

      await waitFor(() =>
        expect(queryByPlaceholderText('Add a comment...')).toBeNull()
      );
      expect(setDraft).not.toHaveBeenCalled();
    });
  });

  describe('replies', () => {
    it('posts create comment message when replying to thread', async () => {
      const user = userEvent.setup();
      const postMessage = jest.spyOn(window.top, 'postMessage').mockImplementation(() => {});

      const {getByPlaceholderText, getByRole} = renderThreadList(
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
          payload: expect.objectContaining({threadId: 1, body: 'My reply'})
        },
        window.location.origin
      );

      postMessage.mockRestore();
    });

    it('includes the quote of the thread range in create comment message', async () => {
      const user = userEvent.setup();
      const postMessage = jest.spyOn(window.top, 'postMessage').mockImplementation(() => {});

      review.contentElementTypes.register('textBlock', {
        extractQuote: configuration => configuration.value
      });

      const subjectRange = {anchor: {path: [0, 0], offset: 0},
                            focus: {path: [0, 0], offset: 6}};

      const {getByPlaceholderText, getByRole} = renderWithReviewState(
        <ThreadList subjectType="ContentElement" subjectId={10} />,
        {
          seed: {
            sections: [{id: 1, permaId: 1}],
            contentElements: [{
              id: 1, permaId: 10, sectionId: 1, typeName: 'textBlock',
              configuration: {value: 'Quoted text'}
            }]
          },
          commentThreads: [
            {id: 1, subjectType: 'ContentElement', subjectId: 10, subjectRange, comments: [
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
          payload: expect.objectContaining({quote: 'Quoted text'})
        },
        window.location.origin
      );

      postMessage.mockRestore();
    });
  });

  describe('resolved threads', () => {
    it('hides resolved threads and shows resolved count pill', () => {
      const {queryByText, getByText} = renderThreadList(
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

      const {getByText, queryByText} = renderThreadList(
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

      await user.click(getByText('1 resolved'));
      expect(queryByText('Resolved thread')).not.toBeInTheDocument();
    });

    it('posts resolve message when resolve button is clicked', async () => {
      const user = userEvent.setup();
      const postMessage = jest.spyOn(window.top, 'postMessage').mockImplementation(() => {});

      const {getByText} = renderThreadList(
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

    it('expands resolved threads by default when expandResolved is set', () => {
      const {getByText} = renderThreadList(
        <ThreadList subjectType="ContentElement" subjectId={10} expandResolved />,
        {
          commentThreads: [
            {id: 1, subjectType: 'ContentElement', subjectId: 10,
             resolvedAt: null,
             comments: [{id: 10, body: 'Active thread', creatorName: 'Alice', creatorId: 1}]},
            {id: 2, subjectType: 'ContentElement', subjectId: 10,
             resolvedAt: '2026-04-09T10:00:00Z',
             comments: [{id: 20, body: 'Resolved thread', creatorName: 'Bob', creatorId: 2}]}
          ]
        }
      );

      expect(getByText('Active thread')).toBeInTheDocument();
      expect(getByText('Resolved thread')).toBeInTheDocument();
    });

    it('leaves resolved threads collapsed while an unresolved one is expanded', () => {
      const {getByText, queryByText} = renderThreadList(
        <ThreadList subjectType="ContentElement" subjectId={10} expandResolved />,
        {
          commentThreads: [
            {id: 1, subjectType: 'ContentElement', subjectId: 10,
             resolvedAt: null,
             comments: [
               {id: 10, body: 'Active thread', creatorName: 'Alice', creatorId: 1},
               {id: 11, body: 'Active reply', creatorName: 'Bob', creatorId: 2}
             ]},
            {id: 2, subjectType: 'ContentElement', subjectId: 10,
             resolvedAt: '2026-04-09T10:00:00Z',
             comments: [
               {id: 20, body: 'Resolved thread', creatorName: 'Bob', creatorId: 2},
               {id: 21, body: 'Resolved reply', creatorName: 'Alice', creatorId: 1}
             ]}
          ]
        }
      );

      expect(getByText('Active reply')).toBeInTheDocument();
      expect(queryByText('Resolved reply')).not.toBeInTheDocument();
    });

    it('expands the only resolved thread when none is unresolved', () => {
      const {getByText} = renderThreadList(
        <ThreadList subjectType="ContentElement" subjectId={10} expandResolved />,
        {
          commentThreads: [
            {id: 1, subjectType: 'ContentElement', subjectId: 10,
             resolvedAt: '2026-04-09T10:00:00Z',
             comments: [
               {id: 10, body: 'Resolved thread', creatorName: 'Bob', creatorId: 2},
               {id: 11, body: 'Resolved reply', creatorName: 'Alice', creatorId: 1}
             ]}
          ]
        }
      );

      expect(getByText('Resolved reply')).toBeInTheDocument();
    });

    it('shows resolved threads instead of the new form when all are resolved and expandResolved is set', () => {
      const {getByText, queryByPlaceholderText} = renderThreadList(
        <ThreadList subjectType="ContentElement" subjectId={10} expandResolved />,
        {
          commentThreads: [
            {id: 1, subjectType: 'ContentElement', subjectId: 10,
             resolvedAt: '2026-04-09T10:00:00Z',
             comments: [{id: 10, body: 'Resolved thread', creatorName: 'Bob', creatorId: 2}]}
          ]
        }
      );

      expect(getByText('Resolved thread')).toBeInTheDocument();
      expect(queryByPlaceholderText('Add a comment...')).not.toBeInTheDocument();
    });

    it('still auto-shows the new form for only-resolved threads without expandResolved', () => {
      const {getByPlaceholderText, queryByText} = renderThreadList(
        <ThreadList subjectType="ContentElement" subjectId={10} />,
        {
          commentThreads: [
            {id: 1, subjectType: 'ContentElement', subjectId: 10,
             resolvedAt: '2026-04-09T10:00:00Z',
             comments: [{id: 10, body: 'Resolved thread', creatorName: 'Bob', creatorId: 2}]}
          ]
        }
      );

      expect(getByPlaceholderText('Add a comment...')).toBeInTheDocument();
      expect(queryByText('Resolved thread')).not.toBeInTheDocument();
    });
  });
});
