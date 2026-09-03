import React, {useRef} from 'react';
import {act, render} from '@testing-library/react';

import {useScrollAnimation} from 'editor/views/inputs/visualizations/useScrollAnimation';

describe('useScrollAnimation', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  function renderScroller({scrollTop, onScroll, rest}) {
    function Scroller() {
      const ref = useRef();

      useScrollAnimation(ref, {scrollTop, onScroll, rest});

      return <div ref={ref} data-testid="scroller" />;
    }

    const {getByTestId} = render(<Scroller />);
    return getByTestId('scroller');
  }

  it('scrolls before the first interval elapses', () => {
    const onScroll = jest.fn();
    const scroller = renderScroller({scrollTop: () => 100, onScroll});

    expect(scroller.scrollTop).toEqual(100);
    expect(onScroll).toHaveBeenCalledWith(scroller);
  });

  it('scrolls back and forth', () => {
    const scroller = renderScroller({scrollTop: (scroller, progress) => 1000 * progress});

    act(() => jest.advanceTimersByTime(1500));
    const scrollTopAtTurningPoint = scroller.scrollTop;

    act(() => jest.advanceTimersByTime(1500));
    const scrollTopAtEnd = scroller.scrollTop;

    act(() => jest.advanceTimersByTime(1500));

    expect(scrollTopAtTurningPoint).toBeGreaterThan(0);
    expect(scrollTopAtEnd).toEqual(1000);
    expect(scroller.scrollTop).toBeLessThan(scrollTopAtEnd);
  });

  it('optionally rests at the end before scrolling back', () => {
    const scroller = renderScroller({
      scrollTop: (scroller, progress) => 1000 * progress,
      rest: 1000
    });

    act(() => jest.advanceTimersByTime(3000));
    const scrollTopAtEnd = scroller.scrollTop;
    act(() => jest.advanceTimersByTime(1000));
    const scrollTopAfterResting = scroller.scrollTop;
    act(() => jest.advanceTimersByTime(500));

    expect(scrollTopAtEnd).toEqual(1000);
    expect(scrollTopAfterResting).toEqual(1000);
    expect(scroller.scrollTop).toBeLessThan(1000);
  });

  it('passes the scroller to the callback', () => {
    const scrollTop = jest.fn().mockReturnValue(0);
    const scroller = renderScroller({scrollTop});

    act(() => jest.advanceTimersByTime(10));

    expect(scrollTop).toHaveBeenCalledWith(scroller, expect.any(Number));
  });

  it('invokes onScroll with the scroller', () => {
    const onScroll = jest.fn();
    const scroller = renderScroller({scrollTop: () => 100, onScroll});

    act(() => jest.advanceTimersByTime(10));

    expect(onScroll).toHaveBeenCalledWith(scroller);
  });

  it('stops scrolling on unmount', () => {
    const onScroll = jest.fn();
    function Scroller() {
      const ref = useRef();
      useScrollAnimation(ref, {scrollTop: () => 100, onScroll});
      return <div ref={ref} />;
    }

    const {unmount} = render(<Scroller />);
    unmount();
    onScroll.mockClear();

    act(() => jest.advanceTimersByTime(100));

    expect(onScroll).not.toHaveBeenCalled();
  });
});
