export function updatePlayerState(player, prevPlayerState, playerState, playerActions){
  if (!prevPlayerState.shouldPrebuffer && playerState.shouldPrebuffer) {
    player.prebuffer().then(() => setTimeout(playerActions.prebuffered, 0));
  }

  if (!prevPlayerState.shouldPlay && playerState.shouldPlay) {
    if (playerState.fadeDuration) {
      player.playAndFadeIn(playerState.fadeDuration);
    }
    else {
      player.playOrPlayOnLoad();
    }
  }
  else if (prevPlayerState.shouldPlay && !playerState.shouldPlay && playerState.isPlaying) {
    if (playerState.fadeDuration) {
      player.fadeOutAndPause(playerState.fadeDuration);
    }
    else {
      player.pause();
    }
  }

  if (playerState.shouldSeekTo !== undefined && prevPlayerState.shouldSeekTo !== playerState.shouldSeekTo ) {
    player.currentTime(playerState.shouldSeekTo);
  }

  if (prevPlayerState.volumeFactor !== playerState.volumeFactor ) {
    player.changeVolumeFactor(playerState.volumeFactor, playerState.volumeFactorFadeDuration);
  }
}
