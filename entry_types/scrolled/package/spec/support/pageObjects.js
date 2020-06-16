import React from 'react';

import {renderInEntry} from './rendering';
import Entry from 'frontend/Entry';
import foregroundStyles from 'frontend/Foreground.module.css';
import {loadInlineEditingComponents} from 'frontend/inlineEditing';
import {api} from 'frontend/api';

import {act, fireEvent, queryHelpers, queries, within} from '@testing-library/react'
import {useFakeTranslations} from 'pageflow/testHelpers';
import {simulateScrollingIntoView} from './fakeIntersectionObserver';

export function renderEntry({seed}) {
  return renderInEntry(<Entry />, {
    seed,
    queries: {...queries, ...pageObjectQueries}
  });
}

export function useInlineEditingPageObjects() {
  beforeAll(async () => {
    await loadInlineEditingComponents();
  });

  useFakeTranslations({
    'pageflow_scrolled.inline_editing.select_section': 'Select section',
    'pageflow_scrolled.inline_editing.select_content_element': 'Select content element',
    'pageflow_scrolled.inline_editing.add_content_element': 'Add content element',
    'pageflow_scrolled.inline_editing.insert_content_element.after': 'Insert content element after',
    'pageflow_scrolled.inline_editing.edit_section_settings': 'Edit section settings',
    'pageflow_scrolled.inline_editing.edit_section_transition_before': 'Edit section transition before',
    'pageflow_scrolled.inline_editing.edit_section_transition_after': 'Edit section transition after'
  });

  usePageObjects();
}

export function usePageObjects() {
  beforeEach(() => {
    api.contentElementTypes.register('withTestId', {
      component: function WithTestId({configuration}) {
        return (
          <div data-testid={`contentElement-${configuration.testId}`} />
        );
      }
    });
  });
}

const pageObjectQueries = {
  getSectionByPermaId(container, permaId) {
    const el = queryHelpers.queryByAttribute('id',
                                             container,
                                             `section-${permaId}`);

    if (!el) {
      throw queryHelpers.getElementError(
        `Unable to find section with perma id ${permaId}.`,
        container
      );
    }

    return createSectionPageObject(el);
  },

  getContentElementByTestId(container, testId) {
    const el = queryHelpers.queryByAttribute('data-testid',
                                             container,
                                             `contentElement-${testId}`);

    if (!el) {
      throw queryHelpers.getElementError(
        `Unable to find content element with testId id ${testId}.`,
        container
      );
    }

    return createContentElementPageObject(el);
  }
}

function createSectionPageObject(el) {
  const selectionRect = el.closest('[aria-label="Select section"]');
  const foreground = el.querySelector(`.${foregroundStyles.Foreground}`);

  return {
    el,

    simulateScrollingIntoView() {
      act(() => simulateScrollingIntoView(el));
    },

    select() {
      fireEvent.mouseDown(selectionRect);
    },

    clickAddContentElement() {
      const {getByTitle} = within(selectionRect);
      fireEvent.click(getByTitle('Add content element'));
    },

    clickEditSettings() {
      const {getByTitle} = within(selectionRect);
      fireEvent.mouseDown(getByTitle('Edit section settings'));
    },

    clickEditTransitionBefore() {
      const {getByTitle} = within(selectionRect);
      fireEvent.mouseDown(getByTitle('Edit section transition before'));
    },

    clickEditTransitionAfter() {
      const {getByTitle} = within(selectionRect);
      fireEvent.mouseDown(getByTitle('Edit section transition after'));
    },

    hasBottomPadding() {
      return foreground.classList.contains(foregroundStyles.paddingBottom);
    }
  }
}

function createContentElementPageObject(el) {
  const selectionRect = el.closest('[aria-label="Select content element"]');

  return {
    select() {
      fireEvent.click(selectionRect);
    },

    clickInsertAfterButton() {
      const {getByTitle} = within(selectionRect);
      fireEvent.click(getByTitle('Insert content element after'));
    }
  }
}
