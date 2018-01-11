pageflow.AudioPlayer.proxyPlayer = function(sources, options) {
  var proxy = {
    position: 0,
    duration: 0
  };

  var emitter = _.extend({}, Backbone.Events);

  proxy.on = emitter.on.bind(emitter);
  proxy.off = emitter.off.bind(emitter);
  proxy.one = emitter.once.bind(emitter);
  proxy.once = emitter.once.bind(emitter);
  proxy.trigger = emitter.trigger.bind(emitter);

  var loaded = new $.Deferred();
  proxy.loadedPromise = loaded.promise();

  var player = new Howl({
    html5: true,
    loop: options.loop,

    src: sources.map(function(source){ return source.src; }),
    //src: 'https://howlerjs.com/assets/howler.js/examples/player/audio/running_out.webm',

    onload: function() {
      proxy.duration = this.duration();
      loaded.resolve();
      emitter.trigger('timeupdate', this.seek(), this.duration());
    }
  });


  var methods = ['load', 'play', 'pause', 'playing', 'stop', 'mute', 'volume', 'rate', 'seek', 'fade'];
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
    return !player.playing();
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


  var timeupdateInterval;
  function startInterval() {
    timeupdateInterval = setInterval(function() {
      player._emit('timeupdate');
    }, 1000);
  }
  function stopInterval() {
    clearInterval(timeupdateInterval);
    timeupdateInterval = null;
  }

  player.on('timeupdate', function() {
    if (this.state() === 'loaded') {
      proxy.position = this.seek();
      emitter.trigger('timeupdate', this.seek(), this.duration());
    }
  });

  player.on('play', function() {
    this._html5 && startInterval();
    emitter.trigger('play');
  });

  player.on('pause', function() {
    this._html5 && stopInterval();
    emitter.trigger('pause');
  });

  player.on('end', function() {
    this._html5 && stopInterval();
    proxy.position = 0,
    emitter.trigger('ended');
  });

  return proxy;
};
