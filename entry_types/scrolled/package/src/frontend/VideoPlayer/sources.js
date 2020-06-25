export function sources(videoFile, quality = 'auto') {
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
