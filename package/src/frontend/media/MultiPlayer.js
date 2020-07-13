import BackboneEvents from 'backbone-events-standalone';
import {AudioPlayer} from '../AudioPlayer';

/**
 * Play and fade between multiple audio files.
 *
 * @class
 */
export const MultiPlayer = function(pool, options) {
  if (options.crossFade && options.playFromBeginning) {
    throw 'pageflow.Audio.MultiPlayer: The options crossFade and playFromBeginning can not be used together at the moment.';
  }

  var current = new AudioPlayer.Null();

  var currentId = null;
  var that = this;


  /**
   * Continue playback.
   */
  this.resume = function() {
    return current.play();
  };

  /**
   * Continue playback with fade in.
   */
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

  this.fadeOutIfPlaying = function () {
    if (current.paused()) {
      return Promise.resolve();
    }
    else{
      return current.fadeOutAndPause(options.fadeDuration);
    }
  }

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
    if (!options.playFromBeginning && id === currentId && !current.paused()) {
      return Promise.resolve();
    }

    var player = pool.get(id);
    currentId = id;

    var fadeOutPromise = current.fadeOutAndPause(options.fadeDuration);

    if (current._stopMultiPlayerEventPropagation && current.paused()) {
      current._stopMultiPlayerEventPropagation();
    }

    return handleCrossFade(fadeOutPromise).then(function() {
      current = player;
      startEventPropagation(current, id);

      return handlePlayFromBeginning(player).then(function() {
        return callback(player);
      });
    });
  }

  function handleCrossFade(fadePomise) {
    if (options.crossFade) {
      return Promise.resolve();
    }
    else {
      return fadePomise;
    }
  }

  function handlePlayFromBeginning(player) {
    if (options.playFromBeginning || options.rewindOnChange) {
      return player.rewind();
    }
    else {
      return Promise.resolve();
    }
  }

  function startEventPropagation(player, id) {
    let playCallback = function() {
      that.trigger('play', {audioFileId: id});
    }
    let pauseCallback = function() {
      that.trigger('pause', {audioFileId: id});

      if (currentId !== id) {
        player._stopMultiPlayerEventPropagation();
      }
    }
    let timeUpdateCallback = function() {
      that.trigger('timeupdate', {audioFileId: id});
    }
    let endedCallback = function() {
      that.trigger('ended', {audioFileId: id});
    }
    let playFailedCallback = function() {
      that.trigger('playfailed', {audioFileId: id});
    }

    player.on('play', playCallback);
    player.on('pause', pauseCallback);
    player.on('timeupdate', timeUpdateCallback);
    player.on('ended', endedCallback);
    player.on('playfailed', playFailedCallback);

    player._stopMultiPlayerEventPropagation = function() {
      player.off('play', playCallback);
      player.off('pause', pauseCallback);
      player.off('timeupdate', timeUpdateCallback);
      player.off('ended', endedCallback);
      player.off('playfailed', playFailedCallback);
    }
  }
};

Object.assign(MultiPlayer.prototype, BackboneEvents);
