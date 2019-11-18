support.fakeEventEmitter = function(obj) {
  return _.extend(obj || {}, Backbone.Events);
};
