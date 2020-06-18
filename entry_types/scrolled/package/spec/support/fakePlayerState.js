import {getInitialPlayerState as initialPlayerState} from 'frontend/MediaPlayer/usePlayerState';

export const getInitialPlayerState = () => {
    let state = initialPlayerState();
    state.shouldPrebuffer = false;
    return state;
  }

export const getPlayerActions = () => {
  return {
    play(){},
    playing(){},
    playFailed(){},
    pause(){},
    paused(){},
    playAndFadeIn(fadeDuration){},
    fadeOutAndPause(fadeDuration){},
    changeVolumeFactor(volumeFactor, fadeDuration){},
    metaDataLoaded(currentTime, duration){},
    progress(bufferedEnd){},
    timeUpdate(currentTime, duration){},
    ended(){},
    scrubTo(time){},
    seekTo(time){},
    seeking(){},
    seeked(){},
    waiting(){},
    prebuffer(){},
    prebuffered(){},
    bufferUnderrun(){},
    bufferUnderrunContinue(){},
    controlsEntered(){},
    controlsLeft(){},
    userInteraction(){},
    userIdle(){},
    focusEnteredControls(){},
    focusLeftControls(){},
    saveMediaElementId(id){},
    discardMediaElementId(){}
  };
}
