pageflow.delayedDestroying = {
  initialize: function() {
    this._destroying = false;
  },

  destroyWithDelay: function() {
    var model = this;

    this.trigger('destroying', this);
    this._destroying = true;

    return Backbone.Model.prototype.destroy.call(this, {
      wait: true,
      success: function() {
        model._destroying = false;
      },
      error: function() {
        model._destroying = false;
      }
    });
  },

  isDestroying: function() {
    return this._destroying;
  }
};