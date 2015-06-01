(function() {
  // Class-y constructor by github.com/opensas
  // https://github.com/jashkenas/backbone/issues/2601

  pageflow.Object = function(options) {
      this.initialize.apply(this, arguments);
  };
  _.extend(pageflow.Object.prototype, Backbone.Events, {
      initialize: function(options) {}
  });

  // The self-propagating extend function that Backbone classes use.
  pageflow.Object.extend = Backbone.Model.extend;
}());
