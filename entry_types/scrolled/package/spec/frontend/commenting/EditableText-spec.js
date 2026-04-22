import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import {useFakeTranslations} from 'pageflow/testHelpers';

import {EditableText} from 'frontend/commenting/EditableText';
import {renderWithCommenting} from 'testHelpers/renderWithCommenting';
import {slateSelection} from 'frontend/commenting/slateSelection';

import {commentHighlightStyles as highlightStyles} from 'pageflow-scrolled/review';
import commentingStyles from 'frontend/commenting/EditableTextHighlight.module.css';

jest.mock('frontend/commenting/slateSelection');

describe('commenting EditableText', () => {
  useFakeTranslations({
    'pageflow_scrolled.review.select_text_to_comment': 'Select text to comment',
    'pageflow_scrolled.review.add_comment_placeholder': 'Add a comment...',
    'pageflow_scrolled.review.new_topic': 'New topic',
    'pageflow_scrolled.review.send': 'Send',
    'pageflow_scrolled.review.cancel': 'Cancel'
  });

  const value = [{type: 'paragraph', children: [{text: 'Some text to comment on'}]}];

  it('renders plain text without commenting UI when inlineComments is not set', () => {
    const {getByText, queryByText, toggleAddCommentMode} = renderWithCommenting(
      <EditableText value={value} />,
      {inlineComments: false}
    );

    toggleAddCommentMode();

    expect(getByText('Some text to comment on')).toBeInTheDocument();
    expect(queryByText('Select text to comment')).not.toBeInTheDocument();
  });

  it('shows hint in add comment mode', () => {
    const {getByText, toggleAddCommentMode} = renderWithCommenting(
      <EditableText value={value} />
    );

    toggleAddCommentMode();

    expect(getByText('Select text to comment')).toBeInTheDocument();
  });

  it('highlights selected range on mouseup in add comment mode', async () => {
    const user = userEvent.setup();
    const slateRange = {
      anchor: {path: [0, 0], offset: 5},
      focus: {path: [0, 0], offset: 9}
    };

    const {getByText, toggleAddCommentMode} = renderWithCommenting(
      <EditableText value={value} />
    );

    toggleAddCommentMode();
    await slateSelection.simulateChange(user, getByText('Some text to comment on'), slateRange);

    const highlight = document.querySelector(`.${highlightStyles.highlight}`);
    expect(highlight).toBeInTheDocument();
    expect(highlight).toHaveTextContent('text');
  });

  it('hides hint after selection is made', async () => {
    const user = userEvent.setup();
    const slateRange = {
      anchor: {path: [0, 0], offset: 5},
      focus: {path: [0, 0], offset: 9}
    };

    const {getByText, queryByText, toggleAddCommentMode} = renderWithCommenting(
      <EditableText value={value} />
    );

    toggleAddCommentMode();
    await slateSelection.simulateChange(user, getByText('Some text to comment on'), slateRange);

    expect(queryByText('Select text to comment')).not.toBeInTheDocument();
  });

  it('shows new thread form after selecting text in add comment mode', async () => {
    const user = userEvent.setup();
    const slateRange = {
      anchor: {path: [0, 0], offset: 5},
      focus: {path: [0, 0], offset: 9}
    };

    const {getByText, getByPlaceholderText, toggleAddCommentMode} = renderWithCommenting(
      <EditableText value={value} />
    );

    toggleAddCommentMode();
    await slateSelection.simulateChange(user, getByText('Some text to comment on'), slateRange);

    expect(getByPlaceholderText('Add a comment...')).toBeInTheDocument();
  });

  it('skips hint and highlights immediately when text is already selected', async () => {
    const user = userEvent.setup();
    const slateRange = {
      anchor: {path: [0, 0], offset: 5},
      focus: {path: [0, 0], offset: 9}
    };

    const {getByText, queryByText, toggleAddCommentMode} = renderWithCommenting(
      <EditableText value={value} />
    );

    await slateSelection.simulateChange(user, getByText('Some text to comment on'), slateRange);
    toggleAddCommentMode();

    expect(queryByText('Select text to comment')).not.toBeInTheDocument();

    const highlight = document.querySelector(`.${highlightStyles.highlight}`);
    expect(highlight).toBeInTheDocument();
    expect(highlight).toHaveTextContent('text');
  });

  it('highlights thread ranges as clickable', () => {
    const subjectRange = {
      anchor: {path: [0, 0], offset: 5},
      focus: {path: [0, 0], offset: 9}
    };

    const {container} = renderWithCommenting(
      <EditableText value={value} />,
      {
        commentThreads: [{
          id: 1,
          subjectType: 'ContentElement',
          subjectId: 10,
          subjectRange,
          comments: [{id: 1, body: 'A comment', creatorName: 'Alice', creatorId: 1}]
        }]
      }
    );

    const highlight = container.querySelector(`.${highlightStyles.highlight}`);
    expect(highlight).toBeInTheDocument();
    expect(highlight).toHaveTextContent('text');
    expect(highlight).toHaveClass(commentingStyles.clickable);
  });

  it('shows badge for thread with subjectRange', () => {
    const subjectRange = {
      anchor: {path: [0, 0], offset: 5},
      focus: {path: [0, 0], offset: 9}
    };

    const {getByRole} = renderWithCommenting(
      <EditableText value={value} />,
      {
        commentThreads: [{
          id: 1,
          subjectType: 'ContentElement',
          subjectId: 10,
          subjectRange,
          comments: [{id: 1, body: 'A comment', creatorName: 'Alice', creatorId: 1}]
        }]
      }
    );

    expect(getByRole('status')).toBeInTheDocument();
  });

  it('does not show new form when selecting range of existing thread', async () => {
    const user = userEvent.setup();
    const subjectRange = {
      anchor: {path: [0, 0], offset: 5},
      focus: {path: [0, 0], offset: 9}
    };

    const {container, queryByPlaceholderText, toggleAddCommentMode} = renderWithCommenting(
      <EditableText value={value} />,
      {
        commentThreads: [{
          id: 1,
          subjectType: 'ContentElement',
          subjectId: 10,
          subjectRange,
          comments: [{id: 1, body: 'A comment', creatorName: 'Alice', creatorId: 1}]
        }]
      }
    );

    toggleAddCommentMode();
    await slateSelection.simulateChange(
      user,
      container.querySelector('[data-slate-editor]'),
      subjectRange
    );

    expect(queryByPlaceholderText('Add a comment...')).not.toBeInTheDocument();
  });
});
