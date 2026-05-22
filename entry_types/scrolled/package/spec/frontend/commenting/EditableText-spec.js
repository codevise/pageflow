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
    'pageflow_scrolled.review.select_text_to_comment': 'Select text to comment'
  });

  const value = [{type: 'paragraph', children: [{text: 'Some text to comment on'}]}];

  it('renders plain text without commenting UI when inlineComments is not set', async () => {
    const user = userEvent.setup();
    const entry = renderEntry({
      contentElement: {ui: <EditableText value={value} />}
    });

    await user.click(entry.getAddCommentButton());

    expect(entry.getByText('Some text to comment on')).toBeInTheDocument();
    expect(entry.queryByText('Select text to comment')).not.toBeInTheDocument();
  });

  it('shows hint in add comment mode', async () => {
    const user = userEvent.setup();
    const entry = renderEntry({
      contentElement: {
        ui: <EditableText value={value} />,
        typeOptions: {inlineComments: true}
      }
    });

    await user.click(entry.getAddCommentButton());

    expect(entry.getByText('Select text to comment')).toBeInTheDocument();
  });

  it('highlights selected range on mouseup in add comment mode', async () => {
    const user = userEvent.setup();
    const slateRange = {
      anchor: {path: [0, 0], offset: 5},
      focus: {path: [0, 0], offset: 9}
    };

    const entry = renderEntry({
      contentElement: {
        ui: <EditableText value={value} />,
        typeOptions: {inlineComments: true}
      }
    });

    await user.click(entry.getAddCommentButton());
    await slateSelection.simulateChange(user, entry.getByText('Some text to comment on'), slateRange);

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

    const entry = renderEntry({
      contentElement: {
        ui: <EditableText value={value} />,
        typeOptions: {inlineComments: true}
      }
    });

    await user.click(entry.getAddCommentButton());
    await slateSelection.simulateChange(user, entry.getByText('Some text to comment on'), slateRange);

    expect(entry.queryByText('Select text to comment')).not.toBeInTheDocument();
  });

  it('shows new thread form after selecting text in add comment mode', async () => {
    const user = userEvent.setup();
    const slateRange = {
      anchor: {path: [0, 0], offset: 5},
      focus: {path: [0, 0], offset: 9}
    };

    const entry = renderEntry({
      contentElement: {
        ui: <EditableText value={value} />,
        typeOptions: {inlineComments: true}
      }
    });

    await user.click(entry.getAddCommentButton());
    await slateSelection.simulateChange(user, entry.getByText('Some text to comment on'), slateRange);

    expect(entry.getNewThreadInput()).toBeInTheDocument();
  });

  it('skips hint and highlights immediately when text is already selected', async () => {
    const user = userEvent.setup();
    const slateRange = {
      anchor: {path: [0, 0], offset: 5},
      focus: {path: [0, 0], offset: 9}
    };

    const entry = renderEntry({
      contentElement: {
        ui: <EditableText value={value} />,
        typeOptions: {inlineComments: true}
      }
    });

    await slateSelection.simulateChange(user, entry.getByText('Some text to comment on'), slateRange);
    await user.click(entry.getAddCommentButton());

    expect(entry.queryByText('Select text to comment')).not.toBeInTheDocument();

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

    const entry = renderEntry({
      contentElement: {
        ui: <EditableText value={multiBlockValue} />,
        typeOptions: {inlineComments: true}
      }
    });

    await user.click(entry.getAddCommentButton());
    await user.click(entry.getByText('Second paragraph'));

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

    const entry = renderEntry({
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

    await user.click(entry.getAddCommentButton());
    await user.click(document.querySelector(`.${highlightStyles.highlight}`));

    expect(entry.getByText('A comment')).toBeInTheDocument();
    expect(entry.queryNewThreadInput()).not.toBeInTheDocument();
  });

  it('highlights thread ranges as clickable', () => {
    const subjectRange = {
      anchor: {path: [0, 0], offset: 5},
      focus: {path: [0, 0], offset: 9}
    };

    const entry = renderEntry({
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

    const highlight = entry.container.querySelector(`.${highlightStyles.highlight}`);
    expect(highlight).toBeInTheDocument();
    expect(highlight).toHaveTextContent('text');
    expect(highlight).toHaveClass(commentingStyles.clickable);
  });

  it('shows badge for thread with subjectRange', () => {
    const subjectRange = {
      anchor: {path: [0, 0], offset: 5},
      focus: {path: [0, 0], offset: 9}
    };

    const entry = renderEntry({
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

    expect(entry.queryAllCommentBadges()).toHaveLength(1);
  });

  it('does not show new form when selecting range of existing thread', async () => {
    const user = userEvent.setup();
    const subjectRange = {
      anchor: {path: [0, 0], offset: 5},
      focus: {path: [0, 0], offset: 9}
    };

    const entry = renderEntry({
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

    await user.click(entry.getAddCommentButton());
    await slateSelection.simulateChange(
      user,
      entry.container.querySelector('[data-slate-editor]'),
      subjectRange
    );

    expect(entry.queryNewThreadInput()).not.toBeInTheDocument();
  });
});
