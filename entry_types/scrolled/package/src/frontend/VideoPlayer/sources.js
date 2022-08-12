import {browser} from 'pageflow/frontend';

browser.feature('dash', () => true);
browser.feature('video', () => true);
browser.feature('highdef', () => true);

export function sources(videoFile, quality = 'auto') {
  if (typeof window !== 'undefined') {
    if (!browser.has('video')) {
      return [];
    }

    if (!browser.has('highdef')) {
      return [
        {
          type: 'video/mp4',
          src: videoFile.urls.high
        }
      ];
    }

    if (!browser.has('dash')) {
      return [
        {
          type: 'video/mp4',
          src: videoFile.urls['4k'] || videoFile.urls.fullhd || videoFile.urls.high
        }
      ];
    }
  }

  if (quality === 'auto') {
    let result = [
      {
        type: 'application/x-mpegURL',
        src: videoFile.urls['hls-playlist']
      },
      {
        type: 'video/mp4',
        src: videoFile.urls.high
      }
    ];

    if (videoFile.urls['dash-playlist']) {
      result = [
        {
          type: 'application/dash+xml',
          src: videoFile.urls['dash-playlist']
        }
      ].concat(result);
    }

    return result;
  }
  else {
    if (!videoFile.urls[quality]) {
      quality = 'high';
    }

    return [
      {
        type: 'video/mp4',
        src: videoFile.urls[quality]
      }
    ];
  }
}
