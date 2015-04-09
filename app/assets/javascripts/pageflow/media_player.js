//= require_self
//= require ./media_player/volume_fading
//= require ./media_player/volume_binding

pageflow.mediaPlayer = {
  enhance: function(player, options) {
    if (options.volumeFading) {
      pageflow.mediaPlayer.volumeFading(player);
      pageflow.mediaPlayer.volumeBinding(player, pageflow.settings);
    }
  }
};