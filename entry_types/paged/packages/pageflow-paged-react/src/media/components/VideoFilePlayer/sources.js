export default function(videoFile, quality, {
  hasHighBandwidth, forceBestQuality, forceFullhdQuality
} = {}) {
  quality = quality || 'auto';

  if (forceBestQuality) {
    return [{
      type: 'video/mp4',
      src: videoFile.urls['4k'] || videoFile.urls.fullhd || videoFile.urls.high
    }];
  }
  if (forceFullhdQuality) {
    return [{
      type: 'video/mp4',
      src: videoFile.urls.fullhd || videoFile.urls.high
    }];
  }
  else if (quality == 'auto') {
    let fallbackQuality = hasHighBandwidth ? 'high' : 'medium';

    let result = [
      {
        type: 'application/x-mpegURL',
        src: `${videoFile.urls['hls-playlist']}?u=1`
      },
      {
        type: 'video/mp4',
        src: `${videoFile.urls[fallbackQuality]}?u=1`
      }
    ];

    if (videoFile.urls['dash-playlist']) {
      result = [
        {
          type: 'application/dash+xml',
          src: `${videoFile.urls['dash-playlist']}`
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
        src: `${videoFile.urls[quality]}?u=1`
      }
    ];
  }
}
