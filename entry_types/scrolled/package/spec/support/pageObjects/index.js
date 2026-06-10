import React from 'react';

import {renderInEntry} from '..';
import {Entry} from 'frontend/Entry';
import {StaticPreview} from 'frontend/useScrollPositionLifecycle';
import {api} from 'frontend/api';

import {act, fireEvent, queryHelpers, queries, within} from '@testing-library/react'
import {simulateScrollingIntoView} from '../fakeIntersectionObserver';

export function renderEntry({
  seed, consent, isStaticPreview, phonePlatform,
  entryProps,
  contentElement,
  contentElementFactory = createContentElementPageObject
} = {}) {
  const effectiveSeed = contentElement ? mergeContentElement(seed, contentElement) : seed;
  const entry = <Entry {...entryProps} />;

  const result = renderInEntry(entry, {
    seed: effectiveSeed,
    consent,
    phonePlatform,
    wrapper: isStaticPreview ? StaticPreview : null,
    queries: {...queries, ...buildPageObjectQueries({contentElementFactory})}
  });

  return {
    ...result,
    rerender() {
      result.rerender(entry);
    }
  }
}

function mergeContentElement(seed, {ui, typeName, typeOptions = {}, permaId = 10, configuration = {}}) {
  let resolvedTypeName = typeName;

  if (ui) {
    resolvedTypeName = 'withUi';
    api.contentElementTypes.register('withUi', {
      ...typeOptions,
      component: function WithUi() { return ui; }
    });
  }

  return {
    ...seed,
    contentElements: [
      ...(seed?.contentElements || []),
      {typeName: resolvedTypeName, permaId, configuration}
    ]
  };
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

function buildPageObjectQueries({contentElementFactory}) {
  return {
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

      return contentElementFactory(el);
    },


    fakeSectionBoundingClientRectsByPermaId,
    fakeContentElementBoundingClientRectsByTestId
  };
}

function fakeSectionBoundingClientRectsByPermaId(container, rectsByPermaId) {
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
}

function fakeContentElementBoundingClientRectsByTestId(container, rectsByTestId) {
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

function createSectionPageObject(el) {
  const selectionRect = el.closest('[aria-label="Select section"]');

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
  }
}

export function createContentElementPageObject(el) {
  const selectionRect = el.closest('[aria-label="Select content element"]');

  return {
    el,

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
  }
}
