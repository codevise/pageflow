import {browser} from '../browser';
import {VideoPlayer} from '../VideoPlayer';

export const createMediaPlayer = function (options) {
  options.tagName = options.tagName || 'video';
  let isAudio = options.tagName == 'audio';
  let playsInline = options.playsInline;

  let mediaElementTemplate = document.createElement(options.tagName);
  mediaElementTemplate.setAttribute('id', 'pageflow_media_element_'+options.playerId);

  const player = new VideoPlayer(mediaElementTemplate, {
    controlBar: false,
    loadingSpinner: false,
    bigPlayButton: false,
    errorDisplay: false,
    textTrackSettings: false,
    poster: undefined,
    loop: options.loop,
    controls: options.controls,
    html5: {
      nativeCaptions: !isAudio && browser.has('iphone platform')
    },

    bufferUnderrunWaiting: true,
    useSlimPlayerControlsDuringPhonePlayback: !playsInline && !isAudio,
    fullscreenDuringPhonePlayback: !playsInline && !isAudio,
    fallbackToMutedAutoplay: !isAudio,

    volumeFading: false, //should be turned on later 
    hooks: undefined,

    mediaEvents: true,
    context: options.mediaContext
  });

  if (playsInline) {
    player.playsinline(true); 
  }

  player.textTrackSettings = {
    getValues() {
      return {};
    }
  };

  player.addClass('video-js');
  player.addClass('player');

  return player;
};
