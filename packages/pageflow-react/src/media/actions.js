import {update as updateSetting} from 'settings/actions';

export const TOGGLE_PLAYING = 'MEDIA_TOGGLE_PLAYING';
export const PLAY = 'MEDIA_PLAY';
export const PLAY_AND_FADE_IN = 'MEDIA_PLAY_AND_FADE_IN';
export const PAUSE = 'MEDIA_PAUSE';
export const FADE_OUT_AND_PAUSE = 'MEDIA_FADE_OUT_AND_PAUSE';

export const CHANGE_VOLUME_FACTOR = 'CHANGE_VOLUME_FACTOR';

export const PLAY_FAILED = 'MEDIA_PLAY_FAILED';
export const PLAYING_MUTED = 'MEDIA_PLAYING_MUTED';

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

export const SHOW_INFO_BOX_DURING_PLAYBACK = 'SHOW_INFO_BOX_DURING_PLAYBACK';
export const HIDE_INFO_BOX_DURING_PLAYBACK = 'HIDE_INFO_BOX_DURING_PLAYBACK';
export const TOGGLE_INFO_BOX_DURING_PLAYBACK = 'TOGGLE_INFO_BOX_DURING_PLAYBACK';

export const SAVE_MEDIA_ELEMENT_ID = 'MEDIA_SAVE_MEDIA_ELEMENT_ID';
export const DISCARD_MEDIA_ELEMENT_ID = 'MEDIA_DISCARD_MEDIA_ELEMENT_ID';

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


    changeVolumeFactor(volumeFactor, {fadeDuration}) {
      return pageAction(CHANGE_VOLUME_FACTOR, {
        volumeFactor,
        fadeDuration
      });
    },


    playFailed() {
      return pageAction(PLAY_FAILED);
    },

    playingMuted() {
      return pageAction(PLAYING_MUTED);
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

    timeUpdate({currentTime, duration}) {
      return pageAction(TIME_UPDATE, {
        currentTime,
        duration
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

    showInfoBoxDuringPlayback() {
      return pageAction(SHOW_INFO_BOX_DURING_PLAYBACK);
    },

    hideInfoBoxDuringPlayback() {
      return pageAction(HIDE_INFO_BOX_DURING_PLAYBACK);
    },

    toggleInfoBoxDuringPlayback() {
      return pageAction(TOGGLE_INFO_BOX_DURING_PLAYBACK);
    },

    saveMediaElementId(id) {
      return pageAction(SAVE_MEDIA_ELEMENT_ID, {id});
    },

    discardMediaElementId() {
      return pageAction(DISCARD_MEDIA_ELEMENT_ID);
    }
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
