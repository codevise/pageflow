import {Object} from 'pageflow/ui';

/**
 * Failure and subclasses are used in the failures api.
 *
 * Subclasses that represent failures that are can not be retried should
 * override `catRetry` with false.
 * Retryable failures should implement `retryAction`.
 *
 * @class
 */
export const Failure = Object.extend({
  canRetry: true,
  type: 'Failure',

  initialize: function(model) {
    this.model = model;
  },

  retry: function() {
    if (this.canRetry) {
      return this.retryAction();
    }
  },

  retryAction: function() {
    return this.model.save();
  },

  key: function() {
    return this.model.cid + '-' + this.type;
  }
});

export const SavingFailure = Failure.extend({
  type: 'SavingFailure'
});

export const OrderingFailure = Failure.extend({
  type: 'OrderingFailure',

  initialize: function(model, collection) {
    Failure.prototype.initialize.call(this, model);
    this.collection = collection;
  },

  retryAction: function() {
    return this.collection.saveOrder();
  }
});
