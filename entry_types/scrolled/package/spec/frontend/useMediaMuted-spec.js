import {useMediaMuted, useOnUnmuteMedia, MediaMutedProvider} from 'frontend/useMediaMuted';
import {media} from 'pageflow/frontend';

import {renderHook, act} from '@testing-library/react-hooks';

describe('useMediaMuted', () => {
  it('returns false if media is not muted', () => {
    media.mute(false);
    const {result} = renderHook(() => useMediaMuted(), {wrapper: MediaMutedProvider});

    expect(result.current).toEqual(false);
  });

  it('returns true if media is muted', () => {
    media.mute(true);
    const {result} = renderHook(() => useMediaMuted(), {wrapper: MediaMutedProvider});

    expect(result.current).toEqual(true);
  });

  it('updates when unmuted', () => {
    media.mute(true);
    const {result} = renderHook(() => useMediaMuted(), {wrapper: MediaMutedProvider});
    act(() => media.mute(false));

    expect(result.current).toEqual(false);
  });
});

describe('useOnUnmuteMedia', () => {
  it('does not invoke callback initially', () => {
    const callback = jest.fn()

    media.mute(true);
    renderHook(() => useOnUnmuteMedia(callback), {wrapper: MediaMutedProvider});

    expect(callback).not.toHaveBeenCalled();
  });

  it('invokes callback when media is unmuted', () => {
    const callback = jest.fn()

    media.mute(true);
    renderHook(() => useOnUnmuteMedia(callback), {wrapper: MediaMutedProvider});
    act(() => media.mute(false));

    expect(callback).toHaveBeenCalled();
  });
});
