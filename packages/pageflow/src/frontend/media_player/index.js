//= require ./media

//= require ./handle_failed_play
//= require ./volume_fading
//= require ./volume_binding
//= require ./load_waiting
//= require ./hooks
//= require ./async_play

pageflow.mediaPlayer = {
  enhance: function(player, options) {
    pageflow.mediaPlayer.handleFailedPlay(player, _.extend({
      hasAutoplaySupport: pageflow.browser.has('autoplay support')
    }, options));

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
