import {act, fireEvent, within} from '@testing-library/react';
import {useFakeTranslations} from 'pageflow/testHelpers';

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
      result.queryAllByRole('status').map(createCommentBadgePageObject)
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

    getMarginIndicator(position) {
      const {getByLabelText} = within(selectionRect);
      const labels = {
        top: 'Top margin',
        bottom: 'Bottom margin'
      };
      return getByLabelText(labels[position]);
    },

    select() {
      fireEvent.click(selectionRect);
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
}

function createCommentBadgePageObject(el) {
  return {
    el,
    isInDotMode: () => el.classList.contains(badgeStyles.dot),
    isActive: () => el.classList.contains(badgeStyles.active),
    select: () => fireEvent.click(el)
  };
}
