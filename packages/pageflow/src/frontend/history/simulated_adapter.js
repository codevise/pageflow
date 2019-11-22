/*global console*/

pageflow.History.SimulatedAdapter = function() {
  var stack = [{
    hash: null,
    state: null
  }];

  this.back = function() {
    if (stack.length > 1) {
      stack.pop();
      this.trigger('popstate');

      return true;
    }
    return false;
  };

  this.pushState = function(state, title, hash) {
    stack.push({
      state: state,
      hash: hash
    });
  };

  this.replaceState = function(state, title, hash) {
    peek().state = state;
    peek().hash = hash;
  };

  this.state = function() {
    return peek().state;
  };

  this.hash = function() {
    return peek().hash;
  };

  function peek() {
    return stack[stack.length - 1];
  }
};

_.extend(pageflow.History.SimulatedAdapter.prototype, Backbone.Events);