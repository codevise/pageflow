import {browser} from '../browser';
import {VideoPlayer} from '../VideoPlayer';

export const createMediaPlayer = function (options) {
  let isAudio = options.tagName == 'AUDIO';

  const player = new VideoPlayer(options.mediaElement, {
    controlBar: false,
    loadingSpinner: false,
    bigPlayButton: false,
    errorDisplay: false,
    textTrackSettings: false,
    poster: options.poster,
    loop: options.loop,
    controls: options.controls,
    html5: {
      nativeCaptions: !isAudio && browser.has('iphone platform')
    },

    bufferUnderrunWaiting: true,
    fallbackToMutedAutoplay: !isAudio,

    volumeFading: true,
    hooks: {},

    mediaEvents: true,
    context: null
  });

  player.textTrackSettings = {
    getValues() {
      return {};
    }
  };

  player.playOrPlayOnLoad = function () {
    if (this.readyState() > 0) {
      player.play();
    } else {
      player.on('loadedmetadata', player.play);
    }
  };

  player.addClass('video-js');
  player.addClass('player');

  return player;
};
