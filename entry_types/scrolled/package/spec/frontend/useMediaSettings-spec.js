import {useMediaSettings} from 'frontend/useMediaSettings';
import {renderHookInEntry} from 'support';

describe('useMediaSettings', () => {
  it('returns media related settings', () => {
    const {result} = renderHookInEntry(() => useMediaSettings());

    expect(result.current).toMatchObject({
      mediaOff: expect.any(Boolean),
      muted: expect.any(Boolean),
      setMuted: expect.any(Function),
    });
  });
});
