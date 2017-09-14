//= require_self
//= require ./media_player/catch_play_promise
//= require ./media_player/volume_fading
//= require ./media_player/volume_binding
//= require ./media_player/load_waiting
//= require ./media_player/hooks
//= require ./media_player/async_play

pageflow.mediaPlayer = {
  enhance: function(player, options) {
    pageflow.mediaPlayer.catchPlayerPromise(player);
    pageflow.mediaPlayer.asyncPlay(player);

    if (options.hooks) {
      pageflow.mediaPlayer.hooks(player, options.hooks);
    }

    if (options.volumeFading) {
      pageflow.mediaPlayer.volumeFading(player);
      pageflow.mediaPlayer.volumeBinding(player, pageflow.settings, options);
    }

    if (options.loadWaiting) {
      pageflow.mediaPlayer.loadWaiting(player);
    }
  }
};