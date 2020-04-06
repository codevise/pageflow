import $ from 'jquery';

export const PushStateAdapter = function() {
  var counter = 0;

  this.back = function() {
    if (counter > 0) {
      window.history.back();
      return true;
    }
    return false;
  };

  this.pushState = function(state, title, hash) {
    counter += 1;
    window.history.pushState(state, title, '#' + hash);
  };

  this.replaceState = function(state, title, hash) {
    window.history.replaceState(state, title, '#' + hash);
  };

  this.state = function() {
    return history.state;
  };

  this.hash = function() {
    var match = window.location.href.match(/#(.*)$/);
    return match ? match[1] : '';
  };

  this.on = function(event, listener) {
    return $(window).on(event, listener);
  };

  $(window).on('popstate', function() {
    counter -= 1;
  });
};
