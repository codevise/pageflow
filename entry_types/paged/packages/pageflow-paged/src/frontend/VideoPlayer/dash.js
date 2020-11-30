import VideoJS from 'video.js';

if (VideoJS.Html5DashJS) {
  VideoJS.Html5DashJS.hook('beforeinitialize', function(player, mediaPlayer) {
    mediaPlayer.getDebug().setLogToBrowserConsole(false);
  });
}
