videojs.Html5DashJS.hook('beforeinitialize', function(player, mediaPlayer) {
  mediaPlayer.getDebug().setLogToBrowserConsole(false);
});
