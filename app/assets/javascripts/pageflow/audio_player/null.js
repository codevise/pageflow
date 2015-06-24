pageflow.AudioPlayer.Null = function() {
  this.playAndFadeIn = function() {
    return new $.Deferred().resolve().promise();
  };

  this.fadeOutAndPause = function() {
    return new $.Deferred().resolve().promise();
  };

  this.play = function() {};

  this.pause = function() {};

  this.seek = function() {};

  this.one = function(event, handler) {
    handler();
  };
};

_.extend(pageflow.AudioPlayer.Null.prototype, Backbone.Events);