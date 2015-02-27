pageflow.AudioPlayer.Null = function() {
  this.playAndFadeIn = function() {
    return new $.Deferred().resolve().promise();
  };

  this.fadeOutAndPause = function() {
    return new $.Deferred().resolve().promise();
  };

  this.play = function() {};

  this.pause = function() {};
};

_.extend(pageflow.AudioPlayer.Null.prototype, Backbone.Events);