import {update as updateSetting} from 'settings/actions';

export const TOGGLE_PLAYING = 'MEDIA_TOGGLE_PLAYING';
export const PLAY = 'MEDIA_PLAY';
export const PLAY_AND_FADE_IN = 'MEDIA_PLAY_AND_FADE_IN';
export const PAUSE = 'MEDIA_PAUSE';
export const FADE_OUT_AND_PAUSE = 'MEDIA_FADE_OUT_AND_PAUSE';

export const SCRUB_TO = 'MEDIA_SCRUB_TO';
export const SEEK_TO = 'MEDIA_SEEK_TO';

export const PREBUFFER = 'MEDIA_PREBUFFER';
export const PREBUFFERED = 'MEDIA_PREBUFFERED';
export const ABORT_PREBUFFERING = 'MEDIA_ABORT_PREBUFFERING';

export const BUFFER_UNDERRUN = 'MEDIA_BUFFER_UNDERRUN';
export const BUFFER_UNDERRUN_CONTINUE = 'MEDIA_BUFFER_UNDERRUN_CONTINUE';

export const META_DATA_LOADED = 'MEDIA_META_DATA_LOADED';
export const PROGRESS = 'MEDIA_PROGRESS';
export const PLAYING = 'MEDIA_PLAYING';
export const PAUSED = 'MEDIA_PAUSED';
export const TIME_UPDATE = 'MEDIA_TIME_UPDATE';
export const ENDED = 'MEDIA_ENDED';

export const SEEKING = 'MEDIA_SEEKING';
export const SEEKED = 'MEDIA_SEEKED';
export const WAITING = 'MEDIA_WAITING';

export const HAS_NOT_BEEN_PLAYING_FOR_A_MOMENT = 'MEDIA_HAS_NOT_BEEN_PLAYING_FOR_A_MOMENT';

export const USER_INTERACTION = 'MEDIA_USER_INTERACTION';
export const USER_IDLE = 'MEDIA_USER_IDLE';

export const CONTROLS_ENTERED = 'MEDIA_CONTROLS_ENTERED';
export const CONTROLS_LEFT = 'MEDIA_CONTROLS_LEFT';
export const FOCUS_ENTERED_CONTROLS = 'MEDIA_FOCUS_ENTERED_CONTROLS';
export const FOCUS_LEFT_CONTROLS = 'MEDIA_FOCUS_LEFT_CONTROLS';
export const CONTROLS_HIDDEN = 'MEDIA_CONTROLS_HIDDEN';

export function actionCreators({scope = 'default'} = {}) {
  return {
    togglePlaying() {
      return pageAction(TOGGLE_PLAYING);
    },

    play() {
      return pageAction(PLAY);
    },

    playAndFadeIn({fadeDuration}) {
      return pageAction(PLAY_AND_FADE_IN, {
        fadeDuration
      });
    },

    pause() {
      return pageAction(PAUSE);
    },

    fadeOutAndPause({fadeDuration}) {
      return pageAction(FADE_OUT_AND_PAUSE, {
        fadeDuration
      });
    },


    scrubTo(time) {
      return pageAction(SCRUB_TO, {
        time
      });
    },

    seekTo(time) {
      return pageAction(SEEK_TO, {
        time
      });
    },


    prebuffer() {
      return pageAction(PREBUFFER);
    },

    prebuffered() {
      return pageAction(PREBUFFERED);
    },

    abortPrebuffering() {
      return pageAction(ABORT_PREBUFFERING);
    },


    bufferUnderrun() {
      return pageAction(BUFFER_UNDERRUN);
    },

    bufferUnderrunContinue() {
      return pageAction(BUFFER_UNDERRUN_CONTINUE);
    },


    playing() {
      return pageAction(PLAYING);
    },

    paused() {
      return pageAction(PAUSED);
    },

    timeUpdate({currentTime}) {
      return pageAction(TIME_UPDATE, {
        currentTime
      });
    },

    metaDataLoaded({currentTime, duration}) {
      return pageAction(META_DATA_LOADED, {
        currentTime,
        duration
      });
    },

    progress({bufferedEnd}) {
      return pageAction(PROGRESS, {
        bufferedEnd
      });
    },

    ended() {
      return pageAction(ENDED);
    },


    seeking() {
      return pageAction(SEEKING);
    },

    seeked() {
      return pageAction(SEEKED);
    },

    waiting() {
      return pageAction(WAITING);
    },


    hasNotBeenPlayingForAMoment(value) {
      return pageAction(HAS_NOT_BEEN_PLAYING_FOR_A_MOMENT);
    },


    userInteraction() {
      return pageAction(USER_INTERACTION);
    },

    userIdle() {
      return pageAction(USER_IDLE);
    },

    controlsEntered() {
      return pageAction(CONTROLS_ENTERED);
    },

    controlsLeft() {
      return pageAction(CONTROLS_LEFT);
    },

    focusEnteredControls() {
      return pageAction(FOCUS_ENTERED_CONTROLS);
    },

    focusLeftControls() {
      return pageAction(FOCUS_LEFT_CONTROLS);
    },

    controlsHidden() {
      return pageAction(CONTROLS_HIDDEN);
    },
  };

  function pageAction(type, payload = {}) {
    return {
      type,
      meta: {
        collectionName: 'pages',
        mediaScope: scope
      },
      payload
    };
  }
}

export function updateTextTrackSettings(textTrack) {
  return updateSetting({
    property: 'textTrack',
    value: textTrack ? {
      srclang: textTrack.srclang,
      kind: textTrack.kind
    } : {}
  });
}

export function updateVideoQualitySetting(value) {
  return updateSetting({
    property: 'videoQuality',
    value
  });
}
