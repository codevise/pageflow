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

  player.one('loadedmetadata', () => actions.saveMediaElementId(player.getMediaElement().id));
}

export function unwatchPlayer(player, actions) {
  player.off('loadedmetadata');

  player.off('progress');

  player.off('play', actions.playing);
  player.off('playfailed', actions.playFailed);
  player.off('pause', actions.paused);
  player.off('waiting', actions.waiting);
  player.off('seeking', actions.seeking);
  player.off('seeked', actions.seeked);
  player.off('bufferunderrun', actions.bufferUnderrun);
  player.off('bufferunderruncontinue', actions.bufferUnderrunContinue);

  player.off('timeupdate');
  
  player.off('canplay');

  player.off('ended', actions.ended);

  actions.discardMediaElementId();
}
