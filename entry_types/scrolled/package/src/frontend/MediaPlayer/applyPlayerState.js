export function applyPlayerState(player, playerState, playerActions){

  player.currentTime(playerState.currentTime);
  
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