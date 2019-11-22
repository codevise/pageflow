//= require ./media_player

//= require_self

//= require ./video_player/dash
//= require ./video_player/use_slim_controls_during_phone_playback
//= require ./video_player/media_events
//= require ./video_player/prebuffering
//= require ./video_player/buffer_underrun_waiting
//= require ./video_player/filter_sources
//= require ./video_player/lazy
//= require ./video_player/cue_settings_methods
//= require ./video_player/get_media_element_method

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