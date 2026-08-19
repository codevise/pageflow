import React from 'react';
import {act} from '@testing-library/react';

import {frontend, Entry, useContentElementViewTimelineProgress} from 'pageflow-scrolled/frontend';

import {renderInEntry} from 'support';
import {
  fakeBoundingClientRectsByClassName,
  fakeBoundingClientRectsByTestId
} from 'support/fakeBoundingClientRects';

import scrollSpaceStyles from 'frontend/ContentElementScrollSpace.module.css';
import twoColumnStyles from 'frontend/layouts/TwoColumn.module.css';

describe('useContentElementViewTimelineProgress', () => {
  beforeEach(() => {
    window.innerHeight = 1000;
  });

  afterEach(() => jest.restoreAllMocks());

  function renderTestContentElement({onProgress, range, viewTimeline = true, position} = {}) {
    frontend.contentElementTypes.register('test', {
      viewTimeline,

      component: function Test() {
        useContentElementViewTimelineProgress({range, onProgress});
        return <div data-testid="testElement" />;
      }
    });

    return renderInEntry(<Entry />, {
      seed: {contentElements: [{typeName: 'test', configuration: {position}}]}
    });
  }

  function simulateScrollTo({top, height = 500}) {
    fakeBoundingClientRectsByTestId({testElement: {top, height}});

    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });
  }

  it('invokes onProgress with current progress on mount', () => {
    const onProgress = jest.fn();
    fakeBoundingClientRectsByTestId({testElement: {top: 250, height: 500}});

    renderTestContentElement({onProgress});

    expect(onProgress).toHaveBeenCalledWith(0.5);
  });

  it('invokes onProgress when scrolling', () => {
    const onProgress = jest.fn();
    fakeBoundingClientRectsByTestId({testElement: {top: 1000, height: 500}});

    renderTestContentElement({onProgress});
    simulateScrollTo({top: -500});

    expect(onProgress).toHaveBeenLastCalledWith(1);
  });

  it('invokes onProgress when resizing', () => {
    const onProgress = jest.fn();
    fakeBoundingClientRectsByTestId({testElement: {top: 1000, height: 500}});

    renderTestContentElement({onProgress});

    fakeBoundingClientRectsByTestId({testElement: {top: 250, height: 500}});

    act(() => {
      window.dispatchEvent(new Event('resize'));
    });

    expect(onProgress).toHaveBeenLastCalledWith(0.5);
  });

  it('does not invoke onProgress again if progress has not changed', () => {
    const onProgress = jest.fn();
    fakeBoundingClientRectsByTestId({testElement: {top: 1000, height: 500}});

    renderTestContentElement({onProgress});
    simulateScrollTo({top: 1200});

    expect(onProgress).toHaveBeenCalledTimes(1);
  });

  it('measures progress for the passed range', () => {
    const onProgress = jest.fn();
    fakeBoundingClientRectsByTestId({testElement: {top: 750, height: 500}});

    renderTestContentElement({onProgress, range: 'entry'});

    expect(onProgress).toHaveBeenCalledWith(0.5);
  });

  it('does not listen for scroll events if onProgress is falsy', () => {
    const addEventListener = jest.spyOn(window, 'addEventListener');

    renderTestContentElement({onProgress: null});

    expect(addEventListener).not.toHaveBeenCalledWith('scroll', expect.any(Function));
  });

  it('listens for scroll events if onProgress is present', () => {
    const addEventListener = jest.spyOn(window, 'addEventListener');

    renderTestContentElement({onProgress: () => {}});

    expect(addEventListener).toHaveBeenCalledWith('scroll', expect.any(Function));
  });

  it('does not observe scroll position if onProgress is falsy', () => {
    const getBoundingClientRect = jest.spyOn(HTMLElement.prototype, 'getBoundingClientRect');

    renderTestContentElement({onProgress: null});
    getBoundingClientRect.mockClear();

    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });

    expect(getBoundingClientRect).not.toHaveBeenCalled();
  });

  it('stops invoking onProgress after unmount', () => {
    const onProgress = jest.fn();
    fakeBoundingClientRectsByTestId({testElement: {top: 1000, height: 500}});

    const {unmount} = renderTestContentElement({onProgress});
    unmount();
    simulateScrollTo({top: 250});

    expect(onProgress).not.toHaveBeenCalledWith(0.5);
  });

  describe('for standAlone content elements', () => {
    it('measures progress along the scroll space', () => {
      const onProgress = jest.fn();
      fakeBoundingClientRectsByClassName({
        [scrollSpaceStyles.wrapper]: {top: 0, height: 1000},
        [scrollSpaceStyles.inner]: {top: 500, height: 500}
      });

      renderTestContentElement({onProgress, position: 'standAlone'});

      expect(onProgress).toHaveBeenCalledWith(0.5);
    });

    it('keeps measuring progress while element is pinned', () => {
      const onProgress = jest.fn();
      fakeBoundingClientRectsByClassName({
        [scrollSpaceStyles.wrapper]: {top: 0, height: 1000},
        [scrollSpaceStyles.inner]: {top: 500, height: 500}
      });

      renderTestContentElement({onProgress, position: 'standAlone'});

      fakeBoundingClientRectsByClassName({
        [scrollSpaceStyles.wrapper]: {top: -500, height: 1000},
        [scrollSpaceStyles.inner]: {top: 500, height: 500}
      });
      act(() => {
        window.dispatchEvent(new Event('scroll'));
      });

      expect(onProgress).toHaveBeenLastCalledWith(0.75);
    });
  });

  describe('for sticky content elements', () => {
    it('measures progress along the group the element sticks in', () => {
      const onProgress = jest.fn();
      fakeBoundingClientRectsByClassName({
        [twoColumnStyles.group]: {top: 0, height: 1000},
        [twoColumnStyles.sticky]: {top: 500, height: 500}
      });

      renderTestContentElement({onProgress, position: 'sticky'});

      expect(onProgress).toHaveBeenCalledWith(0.5);
    });

    it('keeps measuring progress while element is sticky', () => {
      const onProgress = jest.fn();
      fakeBoundingClientRectsByClassName({
        [twoColumnStyles.group]: {top: 0, height: 1000},
        [twoColumnStyles.sticky]: {top: 500, height: 500}
      });

      renderTestContentElement({onProgress, position: 'sticky'});

      fakeBoundingClientRectsByClassName({
        [twoColumnStyles.group]: {top: -500, height: 1000},
        [twoColumnStyles.sticky]: {top: 500, height: 500}
      });
      act(() => {
        window.dispatchEvent(new Event('scroll'));
      });

      expect(onProgress).toHaveBeenLastCalledWith(0.75);
    });

    it('measures ranges relative to the height of the element', () => {
      const onProgress = jest.fn();
      fakeBoundingClientRectsByClassName({
        [twoColumnStyles.group]: {top: 0, height: 2000},
        [twoColumnStyles.sticky]: {top: 0, height: 500}
      });

      renderTestContentElement({onProgress, range: 'contain', position: 'sticky'});

      expect(onProgress).toHaveBeenCalledWith(0.25);
    });

    it('measures pinned range while element is sticky', () => {
      const onProgress = jest.fn();
      fakeBoundingClientRectsByClassName({
        [twoColumnStyles.group]: {top: -450, height: 2000},
        [twoColumnStyles.sticky]: {top: 300, height: 500}
      });

      renderTestContentElement({onProgress, range: 'pinned', position: 'sticky'});

      expect(onProgress).toHaveBeenCalledWith(0.5);
    });

    it('measures center range for inFocus range if element cannot become sticky', () => {
      const onProgress = jest.fn();
      fakeBoundingClientRectsByClassName({
        [twoColumnStyles.group]: {top: 250, height: 300},
        [twoColumnStyles.sticky]: {top: 250, height: 500}
      });

      renderTestContentElement({onProgress, range: 'inFocus', position: 'sticky'});

      expect(onProgress).toHaveBeenCalledWith(0.5);
    });

    it('measures progress of element itself if sticky position is inlined', () => {
      const onProgress = jest.fn();
      window.matchMedia.mockViewportWidth(500);
      fakeBoundingClientRectsByClassName(
        {[twoColumnStyles.group]: {top: 0, height: 1000}},
        {otherElements: {top: 500, height: 500}}
      );

      renderTestContentElement({onProgress, position: 'sticky'});

      expect(onProgress).toHaveBeenCalledWith(1 / 3);
    });
  });

  it('throws descriptive error if content element type is missing flag', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});

    renderTestContentElement({onProgress: () => {}, viewTimeline: false});

    expect(console.error).toHaveBeenCalledWith(expect.stringMatching(
      /only available in content elements for which `viewTimeline: true`/
    ), expect.anything());
  });
});
