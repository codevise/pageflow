export default function(player, actions) {
  player.on('loadedmetadata', () => actions.metaDataLoaded(player.currentTime(), player.duration()));

  player.on('progress', () => actions.progress(player.bufferedEnd()));

  player.on('play', actions.playing);
  player.on('playfailed', actions.playFailed);
  player.on('pause', actions.paused);
  player.on('waiting', actions.waiting);
  player.on('seeking', actions.seeking);
  player.on('seeked', actions.seeked);
  player.on('bufferunderrun', actions.bufferUnderrun);
  player.on('bufferunderruncontinue', actions.bufferUnderrunContinue);

  player.on('timeupdate', () => actions.timeUpdate(player.currentTime(), player.duration()));

  player.on('ended', actions.ended);

  actions.saveMediaElementId(player.id);
}