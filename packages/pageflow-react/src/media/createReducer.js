import {
  PLAY, PLAYING, PLAY_FAILED, PAUSE, PAUSED, SCRUB_TO, SEEK_TO,
  FADE_OUT_AND_PAUSE, PLAY_AND_FADE_IN,
  CHANGE_VOLUME_FACTOR,
  PREBUFFER, PREBUFFERED,
  BUFFER_UNDERRUN, BUFFER_UNDERRUN_CONTINUE, WAITING, SEEKING, SEEKED,
  META_DATA_LOADED, PROGRESS, TIME_UPDATE, ENDED,
  HAS_NOT_BEEN_PLAYING_FOR_A_MOMENT,
  USER_INTERACTION, USER_IDLE,
  CONTROLS_ENTERED, CONTROLS_LEFT,
  FOCUS_ENTERED_CONTROLS, FOCUS_LEFT_CONTROLS,
  CONTROLS_HIDDEN,
  SHOW_INFO_BOX_DURING_PLAYBACK, HIDE_INFO_BOX_DURING_PLAYBACK, TOGGLE_INFO_BOX_DURING_PLAYBACK,
  SAVE_MEDIA_ELEMENT_ID, DISCARD_MEDIA_ELEMENT_ID
} from './actions';

import {HOTKEY_TAB} from 'hotkeys/actions';

import {
  PAGE_WILL_ACTIVATE,
  PAGE_WILL_DEACTIVATE
} from 'pages/actions';

export default function({scope = 'default'} = {}) {
  return function reducer(state = {}, action) {
    if (action.meta &&
        action.meta.mediaScope &&
        action.meta.mediaScope !== scope) {
      return state;
    }

    switch (action.type) {
    case PAGE_WILL_ACTIVATE:
      return {
        ...state,
        hasPlayed: false,
        unplayed: true,
        infoBoxHiddenDuringPlayback: undefined,
        userIsIdle: false
      };
    case PAGE_WILL_DEACTIVATE:
      return {
        ...state,
        shouldPrebuffer: false
      };

    case PLAY:
      return {
        ...state,
        shouldPlay: true,
        playFailed: false,
        hasBeenPlayingJustNow: true,
        unplayed: false,
        fadeDuration: null,
        isLoading: true
      };
    case PLAYING:
      return {
        ...state,
        shouldPlay: true,
        isPlaying: true
      };
    case PLAY_FAILED:
      return {
        ...state,
        shouldPlay: false,
        playFailed: true,
        hasBeenPlayingJustNow: false,
        unplayed: true,
        fadeDuration: null,
        isLoading: false
      };
    case PLAY_AND_FADE_IN:
      return {
        ...state,
        shouldPlay: true,
        hasBeenPlayingJustNow: true,
        fadeDuration: action.payload.fadeDuration,
        isLoading: true
      };
    case PAUSE:
      return {
        ...state,
        shouldPlay: false,
        fadeDuration: null,
        isLoading: false
      };
    case PAUSED:
      if (state.bufferUnderrun) {
        return {
          ...state,
          isPlaying: false,
          hasPlayed: true
        };
      }

      return {
        ...state,
        shouldPlay: false,
        isPlaying: false,
        fadeDuration: null,
        isLoading: false
      };
    case FADE_OUT_AND_PAUSE:
      return {
        ...state,
        shouldPlay: false,
        fadeDuration: action.payload.fadeDuration,
        isLoading: false
      };

    case CHANGE_VOLUME_FACTOR:
      return {
        ...state,
        volumeFactor: action.payload.volumeFactor,
        volumeFactorFadeDuration: action.payload.fadeDuration
      };

    case PREBUFFER:
      return {
        ...state,
        shouldPrebuffer: true
      };
    case PREBUFFERED:
      return {
        ...state,
        shouldPrebuffer: false
      };

    case WAITING:
      return {
        ...state,
        isLoading: true
      };
    case BUFFER_UNDERRUN:
      return {
        ...state,
        bufferUnderrun: true
      };
    case BUFFER_UNDERRUN_CONTINUE:
      return {
        ...state,
        bufferUnderrun: false
      };

    case SCRUB_TO:
      return {
        ...state,
        scrubbingAt: action.payload.time
      };
    case SEEK_TO:
      return {
        ...state,
        shouldSeekTo: action.payload.time
      };

    case SEEKING:
      return {
        ...state,
        isLoading: true
      };
    case SEEKED:
      return {
        ...state,
        scrubbingAt: undefined,
        isLoading: false
      };

    case META_DATA_LOADED:
      return {
        ...state,
        currentTime: action.payload.currentTime,
        duration: action.payload.duration
      };
    case PROGRESS:
      return {
        ...state,
        bufferedEnd: action.payload.bufferedEnd
      };
    case TIME_UPDATE:
      return {
        ...state,
        currentTime: action.payload.currentTime,
        duration: action.payload.duration,
        isLoading: false
      };
    case ENDED:
      return {
        ...state,
        shouldPlay: false,
        isPlaying: false
      };

    case HAS_NOT_BEEN_PLAYING_FOR_A_MOMENT:
      return {
        ...state,
        hasBeenPlayingJustNow: false
      };

    case HOTKEY_TAB:
    case USER_INTERACTION:
      return {
        ...state,
        userIsIdle: false,
        controlsHidden: false
      };
    case USER_IDLE:
      return {
        ...state,
        userIsIdle: true,
      };

    case CONTROLS_ENTERED:
      return {
        ...state,
        userHoveringControls: true
      };
    case CONTROLS_LEFT:
      return {
        ...state,
        userHoveringControls: false
      };
    case FOCUS_ENTERED_CONTROLS:
      return {
        ...state,
        focusInsideControls: true
      };
    case FOCUS_LEFT_CONTROLS:
      return {
        ...state,
        focusInsideControls: false
      };

    case CONTROLS_HIDDEN:
      return {
        ...state,
        controlsHidden: true,
        infoBoxHiddenDuringPlayback: true
      };

    case HIDE_INFO_BOX_DURING_PLAYBACK:
      return {
        ...state,
        infoBoxHiddenDuringPlayback: true
      };
    case SHOW_INFO_BOX_DURING_PLAYBACK:
      return {
        ...state,
        infoBoxHiddenDuringPlayback: false
      };
    case TOGGLE_INFO_BOX_DURING_PLAYBACK:
      return {
        ...state,
        infoBoxHiddenDuringPlayback: !state.infoBoxHiddenDuringPlayback
      };

    case SAVE_MEDIA_ELEMENT_ID:
      return {
        ...state,
        mediaElementId: action.payload.id
      };
    case DISCARD_MEDIA_ELEMENT_ID:
      return {
        ...state,
        mediaElementId: null
      };

    default:
      return state;
    }
  };
}
