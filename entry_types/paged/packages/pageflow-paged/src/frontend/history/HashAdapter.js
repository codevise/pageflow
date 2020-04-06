import $ from 'jquery';

export const HashAdapter = function() {
  var counter = 0;

  this.back = function() {
    if (counter > 0) {
      window.history.back();
      counter -= 1;
      return true;
    }
    return false;
  };

  this.pushState = function(state, title, hash) {
    if (window.location.hash !== hash) {
      counter += 1;
      window.location.hash = hash;
    }
  };

  this.replaceState = function(state, title, hash) {
    window.location.hash = hash;
  };

  this.state = function() {
    return {};
  };

  this.hash = function() {
    var match = window.location.href.match(/#(.*)$/);
    return match ? match[1] : '';
  };

  this.on = function(event, listener) {
    return $(window).on(event, listener);
  };
};