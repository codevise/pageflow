import React from 'react';
import {act, fireEvent, within} from '@testing-library/react';
import {useFakeTranslations} from 'pageflow/testHelpers';

import {EditableInlineText} from 'frontend';
import {api} from 'frontend/api';
import {loadInlineEditingExtensions} from 'frontend/inlineEditing';
import {clearExtensions} from 'frontend/extensionRegistry';
import badgeStyles from 'review/Badge.module.css';

import {useFakeParentWindow} from '../fakeWindows';
import {
  renderEntry as baseRenderEntry,
  createSectionPageObject as baseCreateSectionPageObject,
  createContentElementPageObject as baseCreateContentElementPageObject,
  usePageObjects
} from './index';

export function renderEntry({commenting, ...options} = {}) {
  const result = baseRenderEntry({
    sectionFactory: createInlineEditingSectionPageObject,
    contentElementFactory: createInlineEditingContentElementPageObject,
    ...options,
    entryProps: {commentingInitialState: commenting}
  });

  return {
    ...result,
    queryAllCommentBadges: () =>
      result.queryAllByRole('status').map(createCommentBadgePageObject),

    simulateSelectMessage(payload) {
      act(() => {
        window.dispatchEvent(new MessageEvent('message', {
          data: {type: 'SELECT', payload},
          origin: window.location.origin
        }));
      });
    },

    getTransientContentElementState(id) {
      return window.parent.postMessage.mock.calls
        .map(([message]) => message)
        .filter(message =>
          message.type === 'UPDATE_TRANSIENT_CONTENT_ELEMENT_STATE' &&
          message.payload.id === id
        )
        .map(message => message.payload.state)
        .pop();
    }
  };
}

function createInlineEditingSectionPageObject(el) {
  const selectionRect = el.closest('[aria-label="Select section"]');

  return {
    ...baseCreateSectionPageObject(el),

    select() {
      fireEvent.mouseDown(selectionRect);
    },

    clickAddContentElement() {
      const {getByTitle} = within(selectionRect);
      fireEvent.click(getByTitle('Add content element'));
    },

    clickEditTransitionBefore() {
      const {getByTitle} = within(selectionRect);
      fireEvent.mouseDown(getByTitle('Edit section transition before'));
    },

    clickEditTransitionAfter() {
      const {getByTitle} = within(selectionRect);
      fireEvent.mouseDown(getByTitle('Edit section transition after'));
    },

    getPaddingIndicator(position) {
      const {getByLabelText} = within(selectionRect);
      const labels = {
        top: 'Edit top padding',
        bottom: 'Edit bottom padding'
      };
      return getByLabelText(labels[position]);
    },

    selectPadding(position) {
      fireEvent.mouseDown(selectionRect);
      fireEvent.click(this.getPaddingIndicator(position));
    }
  };
}

function createInlineEditingContentElementPageObject(el) {
  const selectionRect = el.closest('[aria-label="Select content element"]');

  return {
    ...baseCreateContentElementPageObject(el),

    editableText() {
      return createEditableTextPageObject(el.querySelector('[contenteditable=true]'));
    },

    getMarginIndicator(position) {
      const {getByLabelText} = within(selectionRect);
      const labels = {
        top: 'Top margin',
        bottom: 'Bottom margin'
      };
      return getByLabelText(labels[position]);
    },

    select({ctrlKey = false} = {}) {
      fireEvent.mouseDown(selectionRect, {ctrlKey});
      fireEvent.click(selectionRect, {ctrlKey});
    },

    isSelected() {
      return selectionRect.getAttribute('aria-selected') === 'true';
    },

    clickInsertAfterButton() {
      const {getByTitle} = within(selectionRect);
      fireEvent.click(getByTitle('Insert content element after'));
    },

    drag(at, otherContentElement) {
      const {getByTitle} = within(selectionRect);
      fireEvent.dragStart(getByTitle('Drag to move'));
      otherContentElement._drop(at);
    },

    _drop(at) {
      const {getByTestId} = within(selectionRect);
      const target = getByTestId(`drop-${at}`);
      fireEvent.drop(target);
    }
  };
}

export function useInlineEditingPageObjects() {
  useFakeParentWindow();

  beforeAll(async () => {
    await loadInlineEditingExtensions();
  });

  afterAll(() => {
    act(() => clearExtensions());
  });

  useFakeTranslations({
    'pageflow_scrolled.inline_editing.select_section': 'Select section',
    'pageflow_scrolled.inline_editing.select_content_element': 'Select content element',
    'pageflow_scrolled.inline_editing.add_content_element': 'Add content element',
    'pageflow_scrolled.inline_editing.insert_content_element.after': 'Insert content element after',
    'pageflow_scrolled.inline_editing.drag_content_element': 'Drag to move',
    'pageflow_scrolled.inline_editing.edit_section_transition_before': 'Edit section transition before',
    'pageflow_scrolled.inline_editing.edit_section_transition_after': 'Edit section transition after',
    'pageflow_scrolled.inline_editing.edit_section_padding_top': 'Edit top padding',
    'pageflow_scrolled.inline_editing.edit_section_padding_bottom': 'Edit bottom padding',
    'pageflow_scrolled.inline_editing.expose_motif_area': 'Expose motif area',
    'pageflow_scrolled.inline_editing.padding_suppressed_before_full_width': 'Padding suppressed before full width element',
    'pageflow_scrolled.inline_editing.padding_suppressed_after_full_width': 'Padding suppressed after full width element',
    'pageflow_scrolled.inline_editing.content_element_margin_top': 'Top margin',
    'pageflow_scrolled.inline_editing.content_element_margin_bottom': 'Bottom margin'
  });

  usePageObjects();

  beforeEach(() => {
    api.contentElementTypes.register('withEditableInlineText', {
      component: function WithEditableInlineText({configuration}) {
        return (
          <div data-testid={testIdAttribute(configuration)}>
            <EditableInlineText value={configuration.value} />
          </div>
        );
      }
    });
  });
}

function testIdAttribute({testId}) {
  return testId === undefined ? undefined : `contentElement-${testId}`;
}

function createEditableTextPageObject(el) {
  return {
    el,

    click(text, {ctrlKey = false} = {}) {
      const target = within(el).getByText(text);

      if (fireEvent.mouseDown(target, {ctrlKey})) {
        placeCaret(el, target.firstChild);
      }

      fireEvent.click(target, {ctrlKey});
    },

    focus() {
      act(() => el.focus());
    },

    isFocused() {
      return document.activeElement === el;
    }
  };
}

// jsdom neither places a caret on mouse down nor implements
// `isContentEditable` and a selection slate-react can read. Without
// these, slate would ignore the `selectionchange` event.
function placeCaret(editableEl, textNode) {
  const range = document.createRange();
  range.setStart(textNode, 0);

  Object.defineProperty(textNode.parentElement, 'isContentEditable', {value: true});

  window.getSelection = () => Object.assign(range, {
    anchorNode: textNode,
    focusNode: textNode,
    type: 'Caret',
    rangeCount: 1,
    getRangeAt: () => range,
    removeAllRanges() {},
    addRange() {}
  });

  act(() => {
    editableEl.focus();
    document.dispatchEvent(new Event('selectionchange'));
  });
}

function createCommentBadgePageObject(el) {
  return {
    el,
    isInDotMode: () => el.classList.contains(badgeStyles.dot),
    isActive: () => el.classList.contains(badgeStyles.active),
    isResolved: () => el.classList.contains(badgeStyles.resolved),
    isUnread: () => el.classList.contains(badgeStyles.unread),
    select: () => fireEvent.click(el)
  };
}
