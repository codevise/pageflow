pageflow.Audio.MultiPlayer = function(pool, options) {
  var current = new pageflow.AudioPlayer.Null();
  var currentId = null;
  var that = this;

  this.resume = function() {
    return current.play();
  };

  this.resumeAndFadeIn = function() {
    return current.playAndFadeIn(options.fadeDuration);
  };

  this.seek = function(position) {
    return current.seek(position);
  };

  this.pause = function() {
    return current.pause();
  };

  this.paused = function() {
    return current.paused();
  };

  this.fadeOutAndPause = function() {
    return current.fadeOutAndPause(options.fadeDuration);
  };

  this.position = function() {
    return current.position;
  };

  this.duration = function() {
    return current.duration;
  };

  this.fadeTo = function(id) {
    return changeCurrent(id, function(player) {
      return player.playAndFadeIn(options.fadeDuration);
    });
  };

  this.play = function(id) {
    return changeCurrent(id, function(player) {
      return player.play();
    });
  };

  this.changeVolumeFactor = function(factor) {
    return current.changeVolumeFactor(factor, options.fadeDuration);
  };

  this.formatTime = function(time) {
    return current.formatTime(time);
  };

  function changeCurrent(id, callback) {
    if (!options.playFromBeginning && id === currentId) {
      return;
    }

    var player = pool.get(id);
    currentId = id;

    current.fadeOutAndPause(options.fadeDuration).then(function() {
      stopEventPropagation(current);

      current = player;
      startEventPropagation(current, id);

      handlePlayFromBeginning(player).then(function() {
        callback(player);
      });
    });
  }

  function handlePlayFromBeginning(player) {
    if (options.playFromBeginning) {
      return player.rewind();
    }
    else {
      return new $.Deferred().resolve().promise();
    }
  }

  function startEventPropagation(player, id) {
    that.listenTo(player, 'play', function() {
      that.trigger('play', {audioFileId: id});
    });

    that.listenTo(player, 'pause', function() {
      that.trigger('pause', {audioFileId: id});
    });

    that.listenTo(player, 'timeupdate', function() {
      that.trigger('timeupdate', {audioFileId: id});
    });

    that.listenTo(player, 'ended', function() {
      that.trigger('ended', {audioFileId: id});
    });
  }

  function stopEventPropagation(player) {
    that.stopListening(player);
  }
};

_.extend(pageflow.Audio.MultiPlayer.prototype, Backbone.Events);