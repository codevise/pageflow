import {hasHlsSupport} from 'frontend/dash';

import {fakeBrowserAgent} from 'pageflow/testHelpers';
import {normalizeSeed} from 'support';

describe('hasHlsSupport', () => {
  it('returns true on Desktop Safari', () => {
    const agent = fakeBrowserAgent('Safari on macOS')
    const seed = createSeed({hlsHost: 'some-cdn.com'})

    expect(hasHlsSupport({seed, agent})).toEqual(true);
  });

  it('returns true on mobile Safari', () => {
    const agent = fakeBrowserAgent('Safari on iPhone')
    const seed = createSeed({hlsHost: 'some-cdn.com'})

    expect(hasHlsSupport({seed, agent})).toEqual(true);
  });

  it('returns true on Android with supported HLS host', () => {
    const agent = fakeBrowserAgent('Chrome on Android')
    const seed = createSeed({hlsHost: 'some-cdn.com'})

    expect(hasHlsSupport({seed, agent})).toEqual(true);
  });

  it('returns false on Android if underscore in HLS host', () => {
    const agent = fakeBrowserAgent('Chrome on Android')
    const seed = createSeed({hlsHost: 'hls_multimedia.some-cdn.com'})

    expect(hasHlsSupport({seed, agent})).toEqual(false);
  });

  it('returns true on iOS even with underscore in HLS host', () => {
    const agent = fakeBrowserAgent('Safari on iPhone')
    const seed = createSeed({hlsHost: 'hls_multimedia.some-cdn.com'})

    expect(hasHlsSupport({seed, agent})).toEqual(true);
  });

  it('returns false on Desktop Chrome', () => {
    const agent = fakeBrowserAgent('Chrome on Windows')
    const seed = createSeed({hlsHost: 'some-cdn.com'})

    expect(hasHlsSupport({seed, agent})).toEqual(false);
  });

  function createSeed({hlsHost}) {
    return normalizeSeed({
      fileUrlTemplates: {
        videoFiles: {
          'hls-playlist': `//${hlsHost}/v1/main/pageflow/video_files` +
                          '/:id_partition/hls-playlist.m3u8'
        }
      }
    });
  }
});
