export const selectableView = {
  initialize: function() {
    this.selectionAttribute = this.selectionAttribute || this.model.modelName;

    this.listenTo(this.options.selection, 'change:' + this.selectionAttribute, function(selection, selectedModel) {
      this.$el.toggleClass('active', selectedModel === this.model);
    });

    this.$el.toggleClass('active', this.options.selection.get(this.selectionAttribute) === this.model);
  },

  select: function() {
    this.options.selection.set(this.selectionAttribute, this.model);
  },

  onClose: function() {
    if (this.options.selection.get(this.selectionAttribute) === this.model) {
      this.options.selection.set(this.selectionAttribute, null);
    }
  }
};
