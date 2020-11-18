import {useReducer, useMemo} from 'react';
import {createActions,
        PLAY, PLAYING, PLAY_FAILED, PAUSE, PAUSED, SCRUB_TO, SEEK_TO,
        FADE_OUT_AND_PAUSE, PLAY_AND_FADE_IN, CHANGE_VOLUME_FACTOR,
        PREBUFFER, PREBUFFERED, BUFFER_UNDERRUN, BUFFER_UNDERRUN_CONTINUE,
        WAITING, SEEKING, SEEKED, META_DATA_LOADED, PROGRESS, TIME_UPDATE, ENDED,
        MOUSE_ENTERED, MOUSE_LEFT,
        MOUSE_ENTERED_CONTROLS, MOUSE_LEFT_CONTROLS,
        FOCUS_ENTERED_CONTROLS, FOCUS_LEFT_CONTROLS,
        USER_INTERACTION, USER_IDLE, SAVE_MEDIA_ELEMENT_ID, DISCARD_MEDIA_ELEMENT_ID} from './playerActions';

export function getInitialPlayerState(){
  return {
    isPlaying: false,
    shouldPlay: false,
    unplayed: true,
    isLoading: true,
    playFailed: false,
    duration: 0,
    bufferedEnd: 0,
    shouldPrebuffer: true,
    fadeDuration: undefined,
    bufferUnderrun: undefined,
    scrubbingAt: undefined,
    currentTime: 0,
    mediaElementId: undefined,
    shouldSeekTo: undefined,
    userHovering: false,
    userHoveringControls: false,
    focusInsideControls: false,
    userIdle: false,
    volumeFactor: 1,
  };
}

export function playerStateReducer(state, action){
  switch(action.type){
    case PLAY:
      return {
        ...state,
        isLoading: true,
        shouldPlay: true,
        playFailed: false,
        unplayed: false,
        lastControlledVia: action.payload.via
      };
    case PLAYING:
      return {
        ...state,
        shouldPlay: true,
        isPlaying: true,
        userIdle: false
      };
    case PLAY_AND_FADE_IN:
      return {
        ...state,
        shouldPlay: true,
        fadeDuration: action.payload.fadeDuration,
        isLoading: true,
        lastControlledVia: action.payload.via
      };
    case FADE_OUT_AND_PAUSE:
      return {
        ...state,
        shouldPlay: false,
        fadeDuration: action.payload.fadeDuration,
        isLoading: false,
        lastControlledVia: action.payload.via
      };
    case PLAY_FAILED:
      return {
        ...state,
        shouldPlay: false,
        playFailed: true,
        fadeDuration: null,
        unplayed: true,
        isLoading: false
      };
    case PAUSE:
      return {
        ...state,
        shouldPlay: false,
        isLoading: false,
        fadeDuration: null,
        lastControlledVia: action.payload.via
      };
    case PAUSED:
      if (state.bufferUnderrun) {
        return {
          ...state,
          isPlaying: false
        };
      }
      else{
        return {
          ...state,
          shouldPlay: false,
          fadeDuration: null,
          isPlaying: false,
          isLoading: false
        };
      }
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
        isPlaying: false,
        unplayed: true,
        lastControlledVia: null
      };
    case WAITING:
      return {
        ...state,
        isLoading: true
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
    case MOUSE_ENTERED:
      return {
        ...state,
        userHovering: true
      };
    case MOUSE_LEFT:
      return {
        ...state,
        userHovering: false
      };
    case MOUSE_ENTERED_CONTROLS:
      return {
        ...state,
        userHoveringControls: true
      };
    case MOUSE_LEFT_CONTROLS:
      return {
        ...state,
        userHoveringControls: false
      };
    case FOCUS_ENTERED_CONTROLS:
      return {
        ...state,
        focusInsideControls: true,
        userIdle: false
      };
    case FOCUS_LEFT_CONTROLS:
      return {
        ...state,
        focusInsideControls: false,
        userIdle: false
      };
    case USER_INTERACTION:
      return {
        ...state,
        userIdle: false,
      };
    case USER_IDLE:
      return {
        ...state,
        userIdle: true,
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
     case CHANGE_VOLUME_FACTOR:
      return {
        ...state,
        volumeFactor: action.payload.volumeFactor,
        volumeFactorFadeDuration: action.payload.fadeDuration
      };
    default:
      return state;
  }
};

export function usePlayerState(){
  const [state, dispatch] = useReducer(playerStateReducer, getInitialPlayerState());
  const actions = useMemo(() => createActions(dispatch), [dispatch]);

  return [state, actions];
}
