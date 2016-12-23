//= require ./media_player

//= require_self

//= require ./video_player/dash
//= require ./video_player/media_events
//= require ./video_player/prebuffering
//= require ./video_player/buffer_underrun_waiting
//= require ./video_player/src_from_options_method
// require ./video_player/play_button_patch
// require ./video_player/player_buffered_patch
//= require ./video_player/filter_sources
//= require ./video_player/lazy

pageflow.VideoPlayer = function(element, options) {
  options = options || {};

  element = pageflow.VideoPlayer.filterSources(element);
  var player = videojs(element, options);

  pageflow.VideoPlayer.prebuffering(player);
  pageflow.VideoPlayer.srcFromOptionsMethod(player);

  if (options.mediaEvents) {
    pageflow.VideoPlayer.mediaEvents(player, options.context);
  }

  if (options.bufferUnderrunWaiting) {
    pageflow.VideoPlayer.bufferUnderrunWaiting(player);
  }

  pageflow.mediaPlayer.enhance(player, options);

  return player;
};