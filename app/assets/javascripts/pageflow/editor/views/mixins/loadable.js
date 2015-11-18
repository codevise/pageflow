pageflow.loadable = {
  modelEvents: {
    'change:id': function() {
      this.$el.removeClass('creating');
    },

    destroying: function() {
      this.$el.addClass('destroying');
    },

    error: function() {
      this.$el.removeClass('destroying');
    }
  },

  render: function() {
    if (this.model.isNew()) {
      this.$el.addClass('creating');
    }

    if (this.model.isDestroying && this.model.isDestroying()) {
      this.$el.addClass('destroying');
    }
  }
};