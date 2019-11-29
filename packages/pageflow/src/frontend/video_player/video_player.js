pageflow.VideoPlayer = function(element, options) {
  options = options || {};

  element = pageflow.VideoPlayer.filterSources(element);
  var player = videojs(element, options);

  if (options.useSlimPlayerControlsDuringPhonePlayback) {
    pageflow.mediaPlayer.useSlimPlayerControlsDuringPhonePlayback(player);
  }

  pageflow.VideoPlayer.prebuffering(player);
  pageflow.VideoPlayer.cueSettingsMethods(player);
  pageflow.VideoPlayer.getMediaElementMethod(player);

  if (options.mediaEvents) {
    pageflow.VideoPlayer.mediaEvents(player, options.context);
  }

  if (options.bufferUnderrunWaiting) {
    pageflow.VideoPlayer.bufferUnderrunWaiting(player);
  }

  pageflow.mediaPlayer.enhance(player, options);

  return player;
};
