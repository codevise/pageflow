import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import {useFakeTranslations} from 'pageflow/testHelpers';

import {Thread} from 'review/Thread';
import {review} from 'review/api';
import {renderWithReviewState} from 'support/renderWithReviewState';

describe('Thread', () => {
  useFakeTranslations({
    'pageflow_scrolled.review.refers_to_deleted_element': 'Refers to a deleted element',
    'pageflow_scrolled.review.reply_placeholder': 'Reply...',
    'pageflow_scrolled.review.reply_count.one': '1 reply',
    'pageflow_scrolled.review.reply_count.other': '%{count} replies',
    'pageflow_scrolled.review.toggle_replies': 'Toggle replies'
  });

  const thread = {
    id: 1,
    comments: [{id: 10, body: 'On the pull quote', creatorName: 'Bob', creatorId: 2}]
  };

  // The reply form is hidden while a thread with replies is collapsed,
  // which would leave a drafted reply out of reach.
  it('expands a collapsed thread that has a drafted reply', () => {
    const threadWithReply = {
      ...thread,
      comments: [
        ...thread.comments,
        {id: 11, body: 'A first reply', creatorName: 'Alice', creatorId: 1}
      ]
    };

    const {getByPlaceholderText} = renderWithReviewState(
      <Thread thread={threadWithReply} collapsed />,
      {
        drafts: {
          'Thread:1': {threadId: 1, body: 'Half a reply', pending: false}
        }
      }
    );

    expect(getByPlaceholderText('Reply...')).toHaveValue('Half a reply');
  });

  // Two textareas in one card leave it ambiguous which one typing lands in.
  describe('while editing a comment', () => {
    useFakeTranslations({
      'pageflow_scrolled.review.comment_actions': 'Comment actions',
      'pageflow_scrolled.review.edit_comment': 'Edit',
      'pageflow_scrolled.review.cancel': 'Cancel'
    });

    const ownThread = {
      id: 1,
      comments: [
        {id: 10, body: 'On the pull quote', creatorName: 'Bob', creatorId: 2},
        {id: 11, body: 'A first reply', creatorName: 'Bob', creatorId: 2}
      ]
    };

    async function startEditing(user, getAllByRole, index) {
      await user.click(getAllByRole('button', {name: 'Comment actions'})[index]);
      await user.click(getAllByRole('menuitem', {name: 'Edit'})[0]);
    }

    it('hides the reply form', async () => {
      const user = userEvent.setup();

      const {getAllByRole, queryByPlaceholderText} = renderWithReviewState(
        <Thread thread={ownThread} />,
        {currentUser: {id: 2, name: 'Bob'}}
      );

      expect(queryByPlaceholderText('Reply...')).toBeInTheDocument();

      await startEditing(user, getAllByRole, 0);

      expect(queryByPlaceholderText('Reply...')).toBeNull();
    });

    it('restores the reply form when editing ends', async () => {
      const user = userEvent.setup();

      const {getAllByRole, getByRole, queryByPlaceholderText} = renderWithReviewState(
        <Thread thread={ownThread} />,
        {currentUser: {id: 2, name: 'Bob'}}
      );

      await startEditing(user, getAllByRole, 0);
      await user.click(getByRole('button', {name: 'Cancel'}));

      expect(queryByPlaceholderText('Reply...')).toBeInTheDocument();
    });

    it('keeps only one comment in edit mode', async () => {
      const user = userEvent.setup();

      const {getAllByRole} = renderWithReviewState(
        <Thread thread={ownThread} />,
        {currentUser: {id: 2, name: 'Bob'}}
      );

      await startEditing(user, getAllByRole, 0);
      await startEditing(user, getAllByRole, 1);

      expect(getAllByRole('textbox')).toHaveLength(1);
      expect(getAllByRole('textbox')[0]).toHaveValue('A first reply');
    });
  });

  it('renders a deleted-element hint when the thread is orphaned', () => {
    const {getByText} = renderWithReviewState(
      <Thread thread={{...thread, orphaned: true}} interactive={false} />
    );

    expect(getByText('Refers to a deleted element')).toBeInTheDocument();
  });

  it('does not render the hint for a normal thread', () => {
    const {queryByText} = renderWithReviewState(
      <Thread thread={thread} interactive={false} />
    );

    expect(queryByText('Refers to a deleted element')).not.toBeInTheDocument();
  });

  it('renders the hint above the first comment', () => {
    const {getByText} = renderWithReviewState(
      <Thread thread={{...thread, orphaned: true}} interactive={false} />
    );

    const hint = getByText('Refers to a deleted element');
    const comment = getByText('On the pull quote');

    expect(hint.compareDocumentPosition(comment) & Node.DOCUMENT_POSITION_FOLLOWING)
      .toBeTruthy();
  });

  describe('comment quotes', () => {
    const seed = {
      sections: [{id: 1, permaId: 1}],
      contentElements: [
        {
          id: 1, permaId: 10, sectionId: 1, typeName: 'textBlock',
          configuration: {value: 'Current wording'}
        }
      ]
    };

    const quotingThread = {
      ...thread,
      subjectType: 'ContentElement',
      subjectId: 10,
      subjectRange: {anchor: {path: [0, 0], offset: 0}, focus: {path: [0, 0], offset: 7}}
    };

    function threadWithQuotes(...quotes) {
      return {
        ...quotingThread,
        comments: quotes.map((quote, index) => ({
          id: 10 + index,
          body: `Comment ${index + 1}`,
          creatorName: 'Bob',
          creatorId: 2,
          quote
        }))
      };
    }

    beforeEach(() => {
      review.contentElementTypes.register('textBlock', {
        extractQuote: configuration => configuration.value
      });
    });

    afterEach(() => {
      review.contentElementTypes.types = {};
    });

    it('renders a quote for a comment whose text has since changed', () => {
      const {getByText} = renderWithReviewState(
        <Thread thread={threadWithQuotes('Original wording')} interactive={false} />,
        {seed}
      );

      expect(getByText('Original wording')).toBeInTheDocument();
    });

    it('renders no quote while the text still reads the same', () => {
      const {container} = renderWithReviewState(
        <Thread thread={threadWithQuotes('Current wording')} interactive={false} />,
        {seed}
      );

      expect(container.querySelector('blockquote')).toBeNull();
    });

    it('renders the quote inside the comment, above its body', () => {
      const {getByText} = renderWithReviewState(
        <Thread thread={threadWithQuotes('Original wording')} interactive={false} />,
        {seed}
      );

      const quote = getByText('Original wording');
      const body = getByText('Comment 1');

      expect(quote.parentNode).toBe(body.parentNode);
      expect(quote.compareDocumentPosition(body) & Node.DOCUMENT_POSITION_FOLLOWING)
        .toBeTruthy();
    });

    it('renders a quote per version once the text changes mid thread', () => {
      const {getByText} = renderWithReviewState(
        <Thread thread={threadWithQuotes('First wording', 'Second wording')}
                interactive={false} />,
        {seed}
      );

      expect(getByText('First wording')).toBeInTheDocument();
      expect(getByText('Second wording')).toBeInTheDocument();
    });

    it('renders the quote once for a run of replies about the same wording', () => {
      const {queryAllByText} = renderWithReviewState(
        <Thread thread={threadWithQuotes('Same wording', 'Same wording')}
                interactive={false} />,
        {seed}
      );

      expect(queryAllByText('Same wording')).toHaveLength(1);
    });

    it('renders no quote for the last comment when it matches the current text', () => {
      const {getByText, queryByText} = renderWithReviewState(
        <Thread thread={threadWithQuotes('Original wording', 'Current wording')}
                interactive={false} />,
        {seed}
      );

      expect(getByText('Original wording')).toBeInTheDocument();
      expect(queryByText('Current wording')).not.toBeInTheDocument();
    });

    it('renders quotes for threads whose content element was deleted', () => {
      const {getByText} = renderWithReviewState(
        <Thread thread={{...threadWithQuotes('Original wording'),
                         subjectId: 999,
                         orphaned: true}}
                interactive={false} />,
        {seed}
      );

      expect(getByText('Original wording')).toBeInTheDocument();
    });

    it('renders no quote for comments recorded without one', () => {
      const {container} = renderWithReviewState(
        <Thread thread={quotingThread} interactive={false} />,
        {seed}
      );

      expect(container.querySelector('blockquote')).toBeNull();
    });
  });
});
