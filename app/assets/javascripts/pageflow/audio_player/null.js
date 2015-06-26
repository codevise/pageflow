pageflow.AudioPlayer.Null = function() {
  this.playAndFadeIn = function() {
    return new $.Deferred().resolve().promise();
  };

  this.fadeOutAndPause = function() {
    return new $.Deferred().resolve().promise();
  };

  this.changeVolumeFactor = function() {
    return new $.Deferred().resolve().promise();
  };

  this.play = function() {};

  this.pause = function() {};

  this.paused = function() {
    return true;
  };

  this.seek = function() {};

  this.formatTime = function() {};

  this.one = function(event, handler) {
    handler();
  };
};

_.extend(pageflow.AudioPlayer.Null.prototype, Backbone.Events);