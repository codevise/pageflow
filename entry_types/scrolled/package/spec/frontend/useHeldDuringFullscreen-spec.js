import {useHeldDuringFullscreen} from 'frontend/useHeldDuringFullscreen';
import {FullscreenStateProvider} from 'frontend/fullscreenState';
import {renderHook, act} from '@testing-library/react-hooks/dom';
import screenfull from 'screenfull';

jest.mock('screenfull', () => require('support/fakeScreenfull').createFakeScreenfull());

describe('useHeldDuringFullscreen', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    screenfull.isFullscreen = false;
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  function renderHeld(initialValue) {
    return renderHook(({value}) => useHeldDuringFullscreen(value),
                      {
                        initialProps: {value: initialValue},
                        wrapper: FullscreenStateProvider
                      });
  }

  it('passes value through outside of fullscreen', () => {
    const {result, rerender} = renderHeld({shouldLoad: true});

    rerender({value: {shouldLoad: false}});

    expect(result.current).toEqual({shouldLoad: false});
  });

  it('holds value while fullscreen', () => {
    const {result, rerender} = renderHeld({shouldLoad: true});

    screenfull.simulateFullscreenChange(true);
    rerender({value: {shouldLoad: false}});

    expect(result.current).toEqual({shouldLoad: true});
  });

  it('does not hold value if fullscreen was already active on mount', () => {
    screenfull.isFullscreen = true;
    const {result, rerender} = renderHeld({shouldLoad: false});

    rerender({value: {shouldLoad: true}});

    expect(result.current).toEqual({shouldLoad: true});
  });

  it('holds value while native video player is fullscreen', () => {
    const {result, rerender} = renderHeld({shouldLoad: true});

    act(() => {
      document.dispatchEvent(new Event('webkitbeginfullscreen'));
    });
    rerender({value: {shouldLoad: false}});

    expect(result.current).toEqual({shouldLoad: true});
  });

  it('starts settling when native video player exits fullscreen', () => {
    const {result, rerender} = renderHeld({shouldLoad: true});

    act(() => {
      document.dispatchEvent(new Event('webkitbeginfullscreen'));
    });
    rerender({value: {shouldLoad: false}});
    act(() => {
      document.dispatchEvent(new Event('webkitendfullscreen'));
    });
    act(() => jest.advanceTimersByTime(1000));

    expect(result.current).toEqual({shouldLoad: false});
  });

  it('keeps holding when fullscreen is entered again while settling', () => {
    const {result, rerender} = renderHeld({shouldLoad: true});

    screenfull.simulateFullscreenChange(true);
    rerender({value: {shouldLoad: false}});
    screenfull.simulateFullscreenChange(false);
    screenfull.simulateFullscreenChange(true);
    act(() => jest.advanceTimersByTime(1000));

    expect(result.current).toEqual({shouldLoad: true});
  });

  it('keeps holding after fullscreen ends until value matches again', () => {
    const {result, rerender} = renderHeld({shouldLoad: true});

    screenfull.simulateFullscreenChange(true);
    rerender({value: {shouldLoad: false}});
    screenfull.simulateFullscreenChange(false);

    expect(result.current).toEqual({shouldLoad: true});

    rerender({value: {shouldLoad: true}});

    expect(result.current).toEqual({shouldLoad: true});

    rerender({value: {shouldLoad: false}});

    expect(result.current).toEqual({shouldLoad: false});
  });

  it('stops holding after timeout if value does not match again', () => {
    const {result, rerender} = renderHeld({shouldLoad: true});

    screenfull.simulateFullscreenChange(true);
    rerender({value: {shouldLoad: false}});
    screenfull.simulateFullscreenChange(false);
    act(() => jest.advanceTimersByTime(1000));

    expect(result.current).toEqual({shouldLoad: false});
  });
});
