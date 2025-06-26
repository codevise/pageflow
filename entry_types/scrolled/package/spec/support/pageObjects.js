import React from 'react';

import {renderInEntry} from './index';
import {Entry} from 'frontend/Entry';
import foregroundStyles from 'frontend/Foreground.module.css';
import contentElementBoxStyles from 'frontend/ContentElementBox.module.css';
import contentElementMarginStyles from 'frontend/ContentElementMargin.module.css';
import contentElementScrollSpaceStyles from 'frontend/ContentElementScrollSpace.module.css';
import fitViewportStyles from 'frontend/FitViewport.module.css';
import {StaticPreview} from 'frontend/useScrollPositionLifecycle';
import {loadInlineEditingComponents} from 'frontend/inlineEditing';
import {api} from 'frontend/api';

import {act, fireEvent, queryHelpers, queries, within} from '@testing-library/react'
import {useFakeTranslations} from 'pageflow/testHelpers';
import {simulateScrollingIntoView} from './fakeIntersectionObserver';

export function renderEntry({seed, consent, isStaticPreview} = {}) {
  const result = renderInEntry(<Entry />, {
    seed,
    consent,
    wrapper: isStaticPreview ? StaticPreview : null,
    queries: {...queries, ...pageObjectQueries}
  });

  return {
    ...result,
    rerender() {
      result.rerender(<Entry />);
    }
  }
}

export function renderContentElement({typeName, configuration = {}, ...seedOptions} = {}) {
  const seed = {
    contentElements: [{
      permaId: 10,
      typeName,
      configuration
    }],
    ...seedOptions
  };

  const result = renderEntry({seed});

  return {
    ...result,
    getContentElement() {
      const el = result.container.querySelector('[class*="ContentElementMargin_module__wrapper"]');
      
      if (!el) {
        throw queryHelpers.getElementError(
          `Unable to find content element with type ${typeName}.`,
          result.container
        );
      }

      return createContentElementPageObject(el);
    }
  };
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
    'pageflow_scrolled.inline_editing.drag_content_element': 'Drag to move',
    'pageflow_scrolled.inline_editing.edit_section_transition_before': 'Edit section transition before',
    'pageflow_scrolled.inline_editing.edit_section_transition_after': 'Edit section transition after'
  });

  usePageObjects();
}

export function usePageObjects() {
  beforeEach(() => {
    jest.restoreAllMocks();

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
  },


  fakeSectionBoundingClientRectsByPermaId(container, rectsByPermaId) {
    jest.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function() {
      const idAttribute = this.getAttribute('id');
      const permaId = idAttribute?.split('-')[1];

      return {
        top: 0,
        left: 0,
        width: 0,
        height: 0,
        bottom: 0,
        right: 0,
        ...(permaId ? rectsByPermaId[permaId] : {})
      };
    });
  },

  fakeContentElementBoundingClientRectsByTestId(container, rectsByTestId) {
    jest.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function() {
      const testIdAttribute = this.querySelector('[data-testid]')?.getAttribute('data-testid');
      const testId = testIdAttribute?.split('-')[1];

      return {
        top: 0,
        left: 0,
        width: 0,
        height: 0,
        bottom: 0,
        right: 0,
        ...(testId ? rectsByTestId[testId] : {})
      };
    });
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
    containsBox() {
      return !!el.querySelector(`.${contentElementBoxStyles.wrapper}`);
    },

    hasBoxBorderRadius(value) {
      const wrapper = el.querySelector(`.${contentElementBoxStyles.wrapper}`);
      return wrapper && wrapper.style.getPropertyValue('--content-element-box-border-radius') === `var(--theme-content-element-box-border-radius-${value})`;
    },

    getBoxBorderRadius() {
      const wrapper = el.querySelector(`.${contentElementBoxStyles.wrapper}`);
      if (!wrapper) return null;
      
      const cssValue = wrapper.style.getPropertyValue('--content-element-box-border-radius');
      // Extract the value from var(--theme-content-element-box-border-radius-VALUE)
      const match = cssValue.match(/var\(--theme-content-element-box-border-radius-(.+)\)/);
      return match ? match[1] : cssValue;
    },

    hasMargin() {
      return !!el.closest(`.${contentElementMarginStyles.wrapper}`);
    },

    hasScrollSpace() {
      return !!el.closest(`.${contentElementScrollSpaceStyles.wrapper}`);
    },

    hasFitViewport() {
      return !!el.querySelector(`.${fitViewportStyles.container}`);
    },

    getFitViewportAspectRatio() {
      const container = el.querySelector(`.${fitViewportStyles.container}`);
      if (!container) return null;
      
      const cssValue = container.style.getPropertyValue('--fit-viewport-aspect-ratio');
      // Extract the value from var(--theme-aspect-ratio-VALUE) or return the raw value
      const match = cssValue.match(/var\(--theme-aspect-ratio-(.+)\)/);
      return match ? match[1] : cssValue;
    },

    isFitViewportOpaque() {
      const container = el.querySelector(`.${fitViewportStyles.container}`);
      return container?.classList.contains(fitViewportStyles.opaque);
    },

    select() {
      fireEvent.click(selectionRect);
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
  }
}
