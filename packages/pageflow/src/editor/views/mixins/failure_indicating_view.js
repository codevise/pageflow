pageflow.failureIndicatingView = {
  modelEvents: {
    'change:failed': 'updateFailIndicator'
  },

  events: {
    'click .retry': function() {
      pageflow.editor.failures.retry();
      return false;
    }
  },

  onRender: function() {
    this.updateFailIndicator();
  },

  updateFailIndicator: function() {
    this.$el.toggleClass('failed', this.model.isFailed());
    this.$el.find('.failure .message').text(this.model.getFailureMessage());
  }
};
