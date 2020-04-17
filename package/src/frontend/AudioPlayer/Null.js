import Backbone from 'backbone';
import _ from 'underscore';

export const Null = function() {
  this.playAndFadeIn = function() {
    return Promise.resolve();
  };

  this.fadeOutAndPause = function() {
    return Promise.resolve();
  };

  this.changeVolumeFactor = function() {
    return Promise.resolve();
  };

  this.play = function() {};

  this.pause = function() {};

  this.paused = function() {
    return true;
  };

  this.seek = function() {
    return Promise.resolve();
  };

  this.rewind = function() {
    return Promise.resolve();
  };

  this.formatTime = function() {};

  this.one = function(event, handler) {
    handler();
  };
};

_.extend(Null.prototype, Backbone.Events);