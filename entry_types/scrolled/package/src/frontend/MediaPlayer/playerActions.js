import { media } from 'pageflow/frontend';

export const PLAY = 'MEDIA_PLAY';
export const PLAYING = 'MEDIA_PLAYING';
export const PLAY_FAILED = 'MEDIA_PLAY_FAILED';
export const PAUSE = 'MEDIA_PAUSE';
export const PAUSED = 'MEDIA_PAUSED';

export const PLAY_AND_FADE_IN = 'MEDIA_PLAY_AND_FADE_IN';
export const FADE_OUT_AND_PAUSE = 'MEDIA_FADE_OUT_AND_PAUSE';

export const CHANGE_VOLUME_FACTOR = 'CHANGE_VOLUME_FACTOR';

export const META_DATA_LOADED = 'MEDIA_META_DATA_LOADED';
export const PROGRESS = 'MEDIA_PROGRESS';
export const TIME_UPDATE = 'MEDIA_TIME_UPDATE';
export const ENDED = 'MEDIA_ENDED';

export const SCRUB_TO = 'MEDIA_SCRUB_TO';
export const SEEK_TO = 'MEDIA_SEEK_TO';

export const SEEKING = 'MEDIA_SEEKING';
export const SEEKED = 'MEDIA_SEEKED';
export const WAITING = 'MEDIA_WAITING';

export const PREBUFFER = 'MEDIA_PREBUFFER';
export const PREBUFFERED = 'MEDIA_PREBUFFERED';

export const BUFFER_UNDERRUN = 'MEDIA_BUFFER_UNDERRUN';
export const BUFFER_UNDERRUN_CONTINUE = 'MEDIA_BUFFER_UNDERRUN_CONTINUE';

export const MOUSE_ENTERED_CONTROLS = 'MEDIA_MOUSE_ENTERED_CONTROLS';
export const MOUSE_LEFT_CONTROLS = 'MEDIA_MOUSE_LEFT_CONTROLS';
export const FOCUS_ENTERED_CONTROLS = 'MEDIA_FOCUS_ENTERED_CONTROLS';
export const FOCUS_LEFT_CONTROLS = 'MEDIA_FOCUS_LEFT_CONTROLS';
export const USER_INTERACTION = 'MEDIA_USER_INTERACTION';
export const USER_IDLE = 'MEDIA_USER_IDLE';

export const SAVE_MEDIA_ELEMENT_ID = 'MEDIA_SAVE_MEDIA_ELEMENT_ID';
export const DISCARD_MEDIA_ELEMENT_ID = 'MEDIA_DISCARD_MEDIA_ELEMENT_ID';

export function createActions(dispatch){
  return {
    playBlessed({via} = {}){
      media.mute(false);
      dispatch({type: PLAY, payload: {via}});
    },
    play({via} = {}){
      dispatch({type: PLAY, payload: {via}});
    },
    playing(){
      dispatch({type: PLAYING});
    },
    playFailed(){
      dispatch({type: PLAY_FAILED});
    },
    pause({via} = {}){
      dispatch({type: PAUSE, payload: {via}});
    },
    paused(){
      dispatch({type: PAUSED})
    },
    playAndFadeIn(fadeDuration){
      dispatch({type: PLAY_AND_FADE_IN, payload: {fadeDuration: fadeDuration}});
    },
    fadeOutAndPause(fadeDuration){
      dispatch({type: FADE_OUT_AND_PAUSE, payload: {fadeDuration: fadeDuration}});
    },
    changeVolumeFactor(volumeFactor, fadeDuration){
      dispatch({type: CHANGE_VOLUME_FACTOR, payload: {
        fadeDuration: fadeDuration,
        volumeFactor: volumeFactor
      }});
    },
    metaDataLoaded(currentTime, duration){
      dispatch({type: META_DATA_LOADED, payload: {
        currentTime: currentTime,
        duration: duration
      }});
    },
    progress(bufferedEnd){
      dispatch({type: PROGRESS, payload: {
       bufferedEnd: bufferedEnd 
      }});
    },
    timeUpdate(currentTime, duration){
      dispatch({type: TIME_UPDATE, payload: {
        currentTime: currentTime,
        duration: duration
      }});
    },
    ended(){
      dispatch({type: ENDED});
    },
    scrubTo(time){
      dispatch({type: SCRUB_TO, payload: {
       time: time 
      }});
    },
    seekTo(time){
      dispatch({type: SEEK_TO, payload: {
       time: time 
      }});
    },
    seeking(){
      dispatch({type: SEEKING});
    },
    seeked(){
      dispatch({type: SEEKED});
    },
    waiting(){
      dispatch({type: WAITING});
    },
    prebuffer(){
      dispatch({type: PREBUFFER});
    },
    prebuffered(){
      dispatch({type: PREBUFFERED});
    },
    bufferUnderrun(){
      dispatch({type: BUFFER_UNDERRUN});
    },
    bufferUnderrunContinue(){
      dispatch({type: BUFFER_UNDERRUN_CONTINUE});
    },
    mouseEnteredControls(){
      dispatch({type: MOUSE_ENTERED_CONTROLS});
    },
    mouseLeftControls(){
      dispatch({type: MOUSE_LEFT_CONTROLS});
    },
    userInteraction(){
      dispatch({type: USER_INTERACTION});
    },
    userIdle(){
      dispatch({type: USER_IDLE});
    },
    focusEnteredControls(){
      dispatch({type: FOCUS_ENTERED_CONTROLS});
    },
    focusLeftControls(){
      dispatch({type: FOCUS_LEFT_CONTROLS});
    },
    saveMediaElementId(id){
      dispatch({type: SAVE_MEDIA_ELEMENT_ID, payload: {
       id: id 
      }});
    },
    discardMediaElementId(){
      dispatch({type: DISCARD_MEDIA_ELEMENT_ID});
    }
  };
}
