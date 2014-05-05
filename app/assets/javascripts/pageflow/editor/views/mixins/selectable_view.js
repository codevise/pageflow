pageflow.selectableView = {
  initialize: function() {
    this.listenTo(this.options.selection, 'change:' + this.model.modelName, function(selection, selectedModel) {
      this.$el.toggleClass('active', selectedModel === this.model);
    });

    this.$el.toggleClass('active', this.options.selection.get(this.model.modelName) === this.model);
  },

  select: function() {
    this.options.selection.set(this.model.modelName, this.model);
  },

  onClose: function() {
    if (this.options.selection.get(this.model.modelName) === this.model) {
      this.options.selection.set(this.model.modelName, null);
    }
  }
};
