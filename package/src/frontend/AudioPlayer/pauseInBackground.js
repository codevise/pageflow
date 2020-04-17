// Prevent audio play back when browser enters background on mobile
// device. Use the face that timeupdate events continue to fire while
// intervals no longer executed when the browser is in the background.
export const pauseInBackground = function(player) {
  var interval;
  var lastInterval;
  var resolution = 100;

  function startProbeInterval() {
    interval = setInterval(function() {
      lastInterval = new Date().getTime();
    }, resolution);
  }

  function stopProbeInterval() {
    clearInterval(interval);
    interval = null;
  }

  function pauseIfProbeIntervalHalted() {
    if (intervalHalted()) {
      player.pause();
    }
  }

  function intervalHalted() {
    return interval && lastInterval < new Date().getTime() - resolution * 5;
  }

  player.on('play', startProbeInterval);
  player.on('pause', stopProbeInterval);
  player.on('ended', stopProbeInterval);
  player.on('timeupdate', pauseIfProbeIntervalHalted);
};