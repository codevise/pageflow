export default function(player, actions) {
  player.on('loadedmetadata', () => actions.metaDataLoaded({
    currentTime: player.currentTime(),
    duration: player.duration()
  }));

  player.on('progress', () => actions.progress({
    bufferedEnd: player.bufferedEnd()
  }));

  player.on('play', actions.playing);
  player.on('playfailed', actions.playFailed);
  player.on('playmuted', actions.playingMuted);
  player.on('pause', actions.paused);
  player.on('waiting', actions.waiting);
  player.on('seeking', actions.seeking);
  player.on('seeked', actions.seeked);
  player.on('bufferunderrun', actions.bufferUnderrun);
  player.on('bufferunderruncontinue', actions.bufferUnderrunContinue);

  player.on('timeupdate', () => actions.timeUpdate({
    currentTime: player.currentTime(),
    duration: player.duration()
  }));

  player.on('ended', actions.ended);
}
