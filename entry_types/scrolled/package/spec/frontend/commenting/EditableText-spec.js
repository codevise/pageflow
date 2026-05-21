import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import {useFakeTranslations} from 'pageflow/testHelpers';

import {EditableText} from 'frontend/commenting/EditableText';
import {slateSelection} from 'frontend/commenting/slateSelection';
import {renderEntry, useCommentingPageObjects} from 'support/pageObjects/commenting';

import {commentHighlightStyles as highlightStyles} from 'pageflow-scrolled/review';
import commentingStyles from 'frontend/commenting/EditableTextHighlight.module.css';

jest.mock('frontend/commenting/slateSelection');

describe('commenting EditableText', () => {
  useCommentingPageObjects();

  useFakeTranslations({
    'pageflow_scrolled.review.add_comment': 'Add comment',
    'pageflow_scrolled.review.cancel_add_comment': 'Cancel add comment',
    'pageflow_scrolled.review.select_content_element': 'Select to comment',
    'pageflow_scrolled.review.select_text_to_comment': 'Select text to comment',
    'pageflow_scrolled.review.add_comment_placeholder': 'Add a comment...',
    'pageflow_scrolled.review.new_topic': 'New topic',
    'pageflow_scrolled.review.send': 'Send',
    'pageflow_scrolled.review.cancel': 'Cancel'
  });

  const value = [{type: 'paragraph', children: [{text: 'Some text to comment on'}]}];

  it('renders plain text without commenting UI when inlineComments is not set', async () => {
    const {getByText, queryByText, toggleAddCommentMode} = renderEntry({
      contentElement: {ui: <EditableText value={value} />}
    });

    await toggleAddCommentMode();

    expect(getByText('Some text to comment on')).toBeInTheDocument();
    expect(queryByText('Select text to comment')).not.toBeInTheDocument();
  });

  it('shows hint in add comment mode', async () => {
    const {getByText, toggleAddCommentMode} = renderEntry({
      contentElement: {
        ui: <EditableText value={value} />,
        typeOptions: {inlineComments: true}
      }
    });

    await toggleAddCommentMode();

    expect(getByText('Select text to comment')).toBeInTheDocument();
  });

  it('highlights selected range on mouseup in add comment mode', async () => {
    const user = userEvent.setup();
    const slateRange = {
      anchor: {path: [0, 0], offset: 5},
      focus: {path: [0, 0], offset: 9}
    };

    const {getByText, toggleAddCommentMode} = renderEntry({
      contentElement: {
        ui: <EditableText value={value} />,
        typeOptions: {inlineComments: true}
      }
    });

    await toggleAddCommentMode();
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

    const {getByText, queryByText, toggleAddCommentMode} = renderEntry({
      contentElement: {
        ui: <EditableText value={value} />,
        typeOptions: {inlineComments: true}
      }
    });

    await toggleAddCommentMode();
    await slateSelection.simulateChange(user, getByText('Some text to comment on'), slateRange);

    expect(queryByText('Select text to comment')).not.toBeInTheDocument();
  });

  it('shows new thread form after selecting text in add comment mode', async () => {
    const user = userEvent.setup();
    const slateRange = {
      anchor: {path: [0, 0], offset: 5},
      focus: {path: [0, 0], offset: 9}
    };

    const {getByText, getByPlaceholderText, toggleAddCommentMode} = renderEntry({
      contentElement: {
        ui: <EditableText value={value} />,
        typeOptions: {inlineComments: true}
      }
    });

    await toggleAddCommentMode();
    await slateSelection.simulateChange(user, getByText('Some text to comment on'), slateRange);

    expect(getByPlaceholderText('Add a comment...')).toBeInTheDocument();
  });

  it('skips hint and highlights immediately when text is already selected', async () => {
    const user = userEvent.setup();
    const slateRange = {
      anchor: {path: [0, 0], offset: 5},
      focus: {path: [0, 0], offset: 9}
    };

    const {getByText, queryByText, toggleAddCommentMode} = renderEntry({
      contentElement: {
        ui: <EditableText value={value} />,
        typeOptions: {inlineComments: true}
      }
    });

    await slateSelection.simulateChange(user, getByText('Some text to comment on'), slateRange);
    await toggleAddCommentMode();

    expect(queryByText('Select text to comment')).not.toBeInTheDocument();

    const highlight = document.querySelector(`.${highlightStyles.highlight}`);
    expect(highlight).toBeInTheDocument();
    expect(highlight).toHaveTextContent('text');
  });

  it('selects whole top level node when clicking without selection in add comment mode', async () => {
    const user = userEvent.setup();
    const multiBlockValue = [
      {type: 'paragraph', children: [{text: 'First paragraph'}]},
      {type: 'paragraph', children: [{text: 'Second paragraph'}]}
    ];

    const {getByText, toggleAddCommentMode} = renderEntry({
      contentElement: {
        ui: <EditableText value={multiBlockValue} />,
        typeOptions: {inlineComments: true}
      }
    });

    await toggleAddCommentMode();
    await user.click(getByText('Second paragraph'));

    const highlight = document.querySelector(`.${highlightStyles.highlight}`);
    expect(highlight).toBeInTheDocument();
    expect(highlight).toHaveTextContent('Second paragraph');
    expect(highlight).not.toHaveTextContent('First paragraph');
  });

  it('selects existing thread when clicking its highlight in add comment mode', async () => {
    const user = userEvent.setup();
    const subjectRange = {
      anchor: {path: [0, 0], offset: 5},
      focus: {path: [0, 0], offset: 9}
    };

    const {getByText, queryByPlaceholderText, toggleAddCommentMode} = renderEntry({
      contentElement: {
        ui: <EditableText value={value} />,
        typeOptions: {inlineComments: true}
      },
      commenting: {
        currentUser: null,
        commentThreads: [{
          id: 1,
          subjectType: 'ContentElement',
          subjectId: 10,
          subjectRange,
          comments: [{id: 1, body: 'A comment', creatorName: 'Alice', creatorId: 1}]
        }]
      }
    });

    await toggleAddCommentMode();
    await user.click(document.querySelector(`.${highlightStyles.highlight}`));

    expect(getByText('A comment')).toBeInTheDocument();
    expect(queryByPlaceholderText('Add a comment...')).not.toBeInTheDocument();
  });

  it('highlights thread ranges as clickable', () => {
    const subjectRange = {
      anchor: {path: [0, 0], offset: 5},
      focus: {path: [0, 0], offset: 9}
    };

    const {container} = renderEntry({
      contentElement: {
        ui: <EditableText value={value} />,
        typeOptions: {inlineComments: true}
      },
      commenting: {
        currentUser: null,
        commentThreads: [{
          id: 1,
          subjectType: 'ContentElement',
          subjectId: 10,
          subjectRange,
          comments: [{id: 1, body: 'A comment', creatorName: 'Alice', creatorId: 1}]
        }]
      }
    });

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

    const {getByRole} = renderEntry({
      contentElement: {
        ui: <EditableText value={value} />,
        typeOptions: {inlineComments: true}
      },
      commenting: {
        currentUser: null,
        commentThreads: [{
          id: 1,
          subjectType: 'ContentElement',
          subjectId: 10,
          subjectRange,
          comments: [{id: 1, body: 'A comment', creatorName: 'Alice', creatorId: 1}]
        }]
      }
    });

    expect(getByRole('status')).toBeInTheDocument();
  });

  it('does not show new form when selecting range of existing thread', async () => {
    const user = userEvent.setup();
    const subjectRange = {
      anchor: {path: [0, 0], offset: 5},
      focus: {path: [0, 0], offset: 9}
    };

    const {container, queryByPlaceholderText, toggleAddCommentMode} = renderEntry({
      contentElement: {
        ui: <EditableText value={value} />,
        typeOptions: {inlineComments: true}
      },
      commenting: {
        currentUser: null,
        commentThreads: [{
          id: 1,
          subjectType: 'ContentElement',
          subjectId: 10,
          subjectRange,
          comments: [{id: 1, body: 'A comment', creatorName: 'Alice', creatorId: 1}]
        }]
      }
    });

    await toggleAddCommentMode();
    await slateSelection.simulateChange(
      user,
      container.querySelector('[data-slate-editor]'),
      subjectRange
    );

    expect(queryByPlaceholderText('Add a comment...')).not.toBeInTheDocument();
  });
});
