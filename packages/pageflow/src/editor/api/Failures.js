import Backbone from 'backbone';
import _ from 'underscore';

import {Object} from 'pageflow/ui';

import {SavingFailure} from './Failure';

/**
 * API to allow access to failure UI and recovery.
 *
 * Can watch collections for errors saving models and display the error
 * allong with a retry button.
 *
 *     editor.failures.watch(collection);
 *
 * It's possible to add failures to the UI by adding instances of subclasses of Failure:
 *
 *     editor.failures.add(new OrderingFailure(model, collection));
 *
 * @alias Failures
 */
export const FailuresAPI = Object.extend(/** @lends Failures.prototype */{
  initialize: function() {
    this.failures = {};
    this.length = 0;
  },

  /**
   * Listen to the `error` and `sync` events of a collection and
   * create failure objects.
   */
  watch: function(collection) {
    this.listenTo(collection, 'sync', this.remove);

    this.listenTo(collection, 'error', function(model) {
      if (!model.isNew()) {
        this.add(new SavingFailure(model));
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
   * @param {Failure} failure
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

_.extend(FailuresAPI.prototype, Backbone.Events);
