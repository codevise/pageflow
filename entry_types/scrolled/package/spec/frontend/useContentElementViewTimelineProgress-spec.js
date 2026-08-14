import React from 'react';
import {act} from '@testing-library/react';

import {frontend, Entry, useContentElementViewTimelineProgress} from 'pageflow-scrolled/frontend';

import {renderInEntry} from 'support';
import {fakeBoundingClientRectsByTestId} from 'support/fakeBoundingClientRects';

describe('useContentElementViewTimelineProgress', () => {
  beforeEach(() => {
    window.innerHeight = 1000;
  });

  afterEach(() => jest.restoreAllMocks());

  function renderTestContentElement({onProgress, range, viewTimeline = true} = {}) {
    frontend.contentElementTypes.register('test', {
      viewTimeline,

      component: function Test() {
        useContentElementViewTimelineProgress({range, onProgress});
        return <div data-testid="testElement" />;
      }
    });

    return renderInEntry(<Entry />, {
      seed: {contentElements: [{typeName: 'test'}]}
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

  it('throws descriptive error if content element type is missing flag', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});

    renderTestContentElement({onProgress: () => {}, viewTimeline: false});

    expect(console.error).toHaveBeenCalledWith(expect.stringMatching(
      /only available in content elements for which `viewTimeline: true`/
    ), expect.anything());
  });
});
