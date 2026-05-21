import {act, fireEvent} from '@testing-library/react';
import {useFakeTranslations} from 'pageflow/testHelpers';

import {loadInlineEditingComponents} from 'frontend/inlineEditing';
import {clearExtensions} from 'frontend/extensionRegistry';
import badgeStyles from 'review/Badge.module.css';

import {
  renderEntry as baseRenderEntry,
  usePageObjects
} from './index';

export function renderEntry({commenting, ...options} = {}) {
  const result = baseRenderEntry({
    ...options,
    entryProps: {commentingInitialState: commenting}
  });

  return {
    ...result,
    queryAllCommentBadges: () =>
      result.queryAllByRole('status').map(createCommentBadgePageObject)
  };
}

export function useInlineEditingPageObjects() {
  beforeAll(async () => {
    await loadInlineEditingComponents();
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
