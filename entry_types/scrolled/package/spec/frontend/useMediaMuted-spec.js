import {useMediaMuted, MediaMutedProvider} from 'frontend/useMediaMuted';
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
