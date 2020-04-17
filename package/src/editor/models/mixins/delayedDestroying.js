import Backbone from 'backbone';

/**
 * Remove model from collection only after the `DELETE` request has
 * succeeded. Still allow tracking that the model is being destroyed
 * by triggering a `destroying` event and adding a `isDestroying`
 * method.
 */
export const delayedDestroying = {
  initialize: function() {
    this._destroying = false;
    this._destroyed = false;
  },

  /**
   * Trigger `destroying` event and send `DELETE` request. Only remove
   * model from collection once the request is done.
   */
  destroyWithDelay: function() {
    var model = this;

    this._destroying = true;
    this.trigger('destroying', this);

    return Backbone.Model.prototype.destroy.call(this, {
      wait: true,
      success: function() {
        model._destroying = false;
        model._destroyed = true;
      },
      error: function() {
        model._destroying = false;
      }
    });
  },

  /**
   * Get whether the model is currently being destroyed.
   */
  isDestroying: function() {
    return this._destroying;
  },

  /**
   * Get whether the model has been destroyed.
   */
  isDestroyed: function() {
    return this._destroyed;
  }
};
