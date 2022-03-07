import {getFileUrlTemplateHost} from 'entryState';

import {normalizeSeed} from 'support';

describe('getFileUrlTemplateHost', () => {
  it('extracts host from seed', () => {
    const seed =  normalizeSeed({
      fileUrlTemplates: {
        videoFiles: {
          'hls-playlist': `//some-cdn.com/v1/main/pageflow/video_files` +
                          '/:id_partition/hls-playlist.m3u8'
        }
      }
    });

    const result = getFileUrlTemplateHost(seed, 'videoFiles', 'hls-playlist');

    expect(result).toEqual('some-cdn.com');
  });

  it('handles url with protocol', () => {
    const seed =  normalizeSeed({
      fileUrlTemplates: {
        videoFiles: {
          'hls-playlist': `https://some-cdn.com/v1/main/pageflow/video_files` +
                          '/:id_partition/hls-playlist.m3u8'
        }
      }
    });

    const result = getFileUrlTemplateHost(seed, 'videoFiles', 'hls-playlist');

    expect(result).toEqual('some-cdn.com');
  });
});
