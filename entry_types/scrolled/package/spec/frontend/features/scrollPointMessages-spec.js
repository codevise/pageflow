import React from 'react';
import {frontend} from 'frontend';

import {renderEntry, useInlineEditingPageObjects} from 'support/pageObjects';
import {fakeParentWindow} from 'support';

import {asyncHandlingOf} from 'support/asyncHandlingOf';

jest.mock('frontend/useScrollTarget');

describe('scroll point messages', () => {
  useInlineEditingPageObjects();

  beforeEach(() => {
    fakeParentWindow();
    window.parent.postMessage = jest.fn();
    window.scrollTo = jest.fn();
  });

  it('responds with SAVED_SCROLL_POINT message to SAVE_SCROLL_POINT message', async () => {
    renderEntry();

    await asyncHandlingOf(() => {
      window.postMessage({type: 'SAVE_SCROLL_POINT'}, '*');
    });

    expect(window.parent.postMessage).toHaveBeenCalledWith({
      type: 'SAVED_SCROLL_POINT'
    }, expect.anything());
  });

  it('scrolls to first content element with positive viewport y coordinate', async () => {
    const {fakeContentElementBoundingClientRectsByTestId} = renderEntry({
      seed: {
        contentElements: [
          {typeName: 'withTestId', configuration: {testId: 1}},
          {typeName: 'withTestId', configuration: {testId: 2}},
          {typeName: 'withTestId', configuration: {testId: 3}}
        ]
      }
    });

    window.scrollY = 1000;
    fakeContentElementBoundingClientRectsByTestId({
      1: {top: -100},
      2: {top: 30},
      3: {top: 900},
    });

    await asyncHandlingOf(() => {
      window.postMessage({type: 'SAVE_SCROLL_POINT'}, '*');
    });
    await asyncHandlingOf(() => {
      window.postMessage({type: 'RESTORE_SCROLL_POINT'}, '*');
    });

    const offset = 100;
    expect(window.scrollTo).toHaveBeenCalledWith(expect.objectContaining({
      top: 30 + window.scrollY - offset
    }));
  });

  it('scrolls to selected content element if present', async () => {
    const {getContentElementByTestId, fakeContentElementBoundingClientRectsByTestId} = renderEntry({
      seed: {
        contentElements: [
          {typeName: 'withTestId', configuration: {testId: 1}},
          {typeName: 'withTestId', configuration: {testId: 2}},
          {typeName: 'withTestId', configuration: {testId: 3}}
        ]
      }
    });

    window.scrollY = 1000;
    fakeContentElementBoundingClientRectsByTestId({
      1: {top: -100},
      2: {top: 30},
      3: {top: 900},
    });
    getContentElementByTestId(3).select();

    await asyncHandlingOf(() => {
      window.postMessage({type: 'SAVE_SCROLL_POINT'}, '*');
    });
    await asyncHandlingOf(() => {
      window.postMessage({type: 'RESTORE_SCROLL_POINT'}, '*');
    });

    const offset = 100;
    expect(window.scrollTo).toHaveBeenCalledWith(expect.objectContaining({
      top: 900 + window.scrollY - offset
    }));
  });
});
