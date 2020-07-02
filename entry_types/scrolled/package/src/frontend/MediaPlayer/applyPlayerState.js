export function applyPlayerState(player, playerState, playerActions){
  player.one('loadedmetadata', () => player.currentTime(playerState.currentTime));
  player.changeVolumeFactor(playerState.volumeFactor, 0);

  if (playerState.shouldPrebuffer) {
    player.prebuffer().then(playerActions.prebuffered);
  }

  if (playerState.isPlaying) {
    player.play();
  }

  player.on('canplay', function () {
    if (playerState.shouldPlay && player.paused()) {
      player.play();
    }
  });
}
