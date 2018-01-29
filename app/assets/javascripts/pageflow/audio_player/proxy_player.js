pageflow.AudioPlayer.proxyPlayer = function(sources, options) {
  var proxy = {
    position: 0,
    duration: 0
  };

  var playing = false;
  var fadeDeferred = $.Deferred();

  var emitter = _.extend({}, Backbone.Events);

  proxy.on = emitter.on.bind(emitter);
  proxy.off = emitter.off.bind(emitter);
  proxy.one = emitter.once.bind(emitter);
  proxy.once = emitter.once.bind(emitter);
  proxy.trigger = emitter.trigger.bind(emitter);

  var loaded = new $.Deferred();
  proxy.loadedPromise = loaded.promise();

  var player = new Howl({
    loop: options.loop,
    src: sources.map(function(source){ return source.src; }),

    onload: function() {
      proxy.duration = this.duration();
      loaded.resolve();
      emitter.trigger('timeupdate', 0, proxy.duration);
    },
    onplay: function() {
      if (!playing) {
        playing = true;
        emitter.trigger('play');
        startInterval();
      }
    },
    onpause: function() {
      if (playing) {
        playing = false;
        stopInterval();
        emitter.trigger('pause');
      }
    },
    onfade: function() {
      fadeDeferred.resolve();
    },
    onend: function() {
      if (!this.playing()) {
        playing = false;
        proxy.position = 0;
        stopInterval();
      }
      emitter.trigger('ended');
    },
    ontimeupdate: function() {
      if (playing && this.state() === 'loaded') {
        proxy.position = this.seek();
        emitter.trigger('timeupdate', proxy.position, proxy.duration);
      }
    }
  });


  var methods = ['load', 'play', 'pause', 'stop', 'mute', 'volume',
    'rate', 'seek', 'fade'];
  _.each(methods, function(method) {
    proxy[method] = player[method].bind(player);
  });


  proxy.currentSrc = function() {
    return player._src;
  };
  proxy.currentTime = function() {
    return player.seek();
  };
  proxy.paused = function() {
    return !playing;
  };
  proxy.playing = function() {
    return playing;
  };

  /**
   * https://github.com/zohararad/audio5js/blob/master/src/audio5.js#L262
   * Formats seconds into a time string hh:mm:ss.
   * @param {Number} seconds seconds to format as string
   * @return {String} formatted time string
   */
  proxy.formatTime = function(seconds) {
    var hours = parseInt(seconds / 3600, 10) % 24;
    var minutes = parseInt(seconds / 60, 10) % 60;
    var secs = parseInt(seconds % 60, 10);
    var result, fragment = (minutes < 10 ? "0" + minutes : minutes) + ":" + (secs  < 10 ? "0" + secs : secs);
    if (hours > 0) {
      result = (hours < 10 ? "0" + hours : hours) + ":" + fragment;
    } else {
      result = fragment;
    }
    return result;
  };

  proxy.fadeVolume = function(newVolume, duration) {
    var currentVolume = this.volume();
    this.fade(currentVolume, newVolume, duration);
    return fadeDeferred.promise();
  };


  var timeupdateInterval;
  function startInterval() {
    if (player._webAudio && !timeupdateInterval) {
      timeupdateInterval = setInterval(function() {
        proxy.position = player.seek();
        emitter.trigger('timeupdate', proxy.position, proxy.duration);
      }, 250);
    }
  }
  function stopInterval() {
    if (player._webAudio && timeupdateInterval) {
      clearInterval(timeupdateInterval);
      timeupdateInterval = null;
    }
  }

  return proxy;
};
