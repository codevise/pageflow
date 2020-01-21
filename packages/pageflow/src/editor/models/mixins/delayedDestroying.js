import Backbone from 'backbone';

export const delayedDestroying = {
  initialize: function() {
    this._destroying = false;
    this._destroyed = false;
  },

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