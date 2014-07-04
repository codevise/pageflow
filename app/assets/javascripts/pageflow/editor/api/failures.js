/**
 * API to allow access to failure UI and recovery.
 * Global instance at pageflow.failures.
 */
pageflow.FailuresAPI = pageflow.Object.extend({
  initialize: function() {
    this.failures = {};
    this.length = 0;
  },

  watch: function(collection) {
    this.listenTo(collection, 'sync', this.remove);

    this.listenTo(collection, 'error', function(model) {
      if (!model.isNew()) {
        this.add(new pageflow.SavingFailure(model));
      }
    });
  },

  retry: function() {
    _.each(this.failures, function(failure, key) {
      this.remove(key);
      failure.retry();
    }, this);
  },

  isEmpty: function() {
    return _.size(this.failures) === 0;
  },

  add: function(failure) {
    this.failures[failure.key()] = failure;
    this.length = _.size(this.failures);
  },

  remove: function(key) {
    delete this.failures[key];
    this.length = _.size(this.failures);
  },

  count: function() {
    return this.length;
  }
});

_.extend(pageflow.FailuresAPI.prototype, Backbone.Events);
