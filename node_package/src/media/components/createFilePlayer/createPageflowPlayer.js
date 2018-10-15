export default function createPageflowPlayer(
  element,
  {emulateTextTracksDisplay, atmoSettings, mediaContext, playsInline}
) {
  const isAudio = element.tagName.toLowerCase() == 'audio';

  const player = new pageflow.VideoPlayer(element, {
    controlBar: false,
    loadingSpinner: false,
    bigPlayButton: false,
    errorDisplay: false,
    textTrackSettings: false,

    poster: element.getAttribute('data-poster'),

    html5: {
      nativeCaptions: !isAudio && pageflow.browser.has('iphone platform')
    },

    bufferUnderrunWaiting: true,
    useSlimPlayerControlsDuringPhonePlayback: !playsInline && !isAudio,
    fullscreenDuringPhonePlayback: !playsInline && !isAudio,
    fallbackToMutedAutoplay: !isAudio,

    volumeFading: true,
    hooks: pageflow.atmo.createMediaPlayerHooks(atmoSettings),

    mediaEvents: true,
    context: mediaContext
  });

  player.textTrackSettings = {
    getValues() {
      return {};
    }
  };

  player.addClass('video-js');
  player.addClass('player');

  return player;
}
