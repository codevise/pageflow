pageflow.VideoPlayer.srcFromOptionsMethod = function(player) {
  var extensions = ['m3u8', 'mp4'];

  player.srcFromOptions = function() {
    var extension = getVideoExtension(player.currentSrc()),
        source = detectSourceWithExtension(extension);

    if (extension && source) {
      return source.src;
    }
    else {
      return player.currentSrc();
    }
  };

  function getVideoExtension(src) {
    return _.detect(extensions, function(extension) {
      return matchesExtension(src, extension);
    });
  }

  function detectSourceWithExtension(extension) {
    return _.detect(player.options().sources, function(source) {
      return matchesExtension(source.src, extension);
    });
  }

  function matchesExtension(src, extension) {
    return src.indexOf('.' + extension + '?') >= 0;
  }
};