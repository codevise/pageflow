export function updatePlayerState(player, prevPlayerState, playerState, playerActions, componentState, isAutoplay, isMediaOff){

  if (!isMediaOff && isAutoplay) {
    if (componentState === 'active') {
      if (player.readyState() > 0) {
        player.play();
      } else {
        player.on('loadedmetadata', player.play);
      }  
    }
    else {
      player.pause();
    }
  }

  if (playerState.shouldPrebuffer) {
    player.prebuffer().then(() => setTimeout(playerActions.prebuffered, 0));
  }

  if (playerState.shouldPlay) {
    if (playerState.fadeDuration) {
      player.playAndFadeIn(playerState.fadeDuration);
    }
    else {
      player.play();
    }
  }
  else if (!playerState.shouldPlay && playerState.isPlaying) {
    if (playerState.fadeDuration) {
      player.fadeOutAndPause(playerState.fadeDuration);
    }
    else {
      player.pause();
    }
  }

  if (playerState.shouldSeekTo !== undefined) {
    player.currentTime(playerState.shouldSeekTo);
    playerState.shouldSeekTo = undefined;
  }

}