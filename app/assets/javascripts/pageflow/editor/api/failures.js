/**
 * API to allow access to failure UI and recovery.
 *
 * Can watch collections for errors saving models and display the error
 * allong with a retry button.
 *
 *     pageflow.editor.failures.watch(collection);
 *
 * It's possible to add failures to the UI by adding instances of subclasses of pageflow.Failure:
 *
 *     pageflow.editor.failures.add(new pageflow.OrderingFailure(model, collection));
 *
 * @alias pageflow.Failures
 * @memberof module:pageflow/editor
 */
pageflow.FailuresAPI = pageflow.Object.extend(
/** @lends module:pageflow/editor.pageflow.Failures */{
  initialize: function() {
    this.failures = {};
    this.length = 0;
  },

  /**
   * Listen to the `error` and `sync` events of a collection and
   * create {@link module:pageflow/editor.pageflow.SavingFailure
   * pageflow.SavingFailure} objects.
   */
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

  /**
   * Record that a failure occured.
   *
   * @param {pageflow.Failure} failure
   * The failure object to add.
   */
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
