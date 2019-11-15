import Marionette from 'backbone.marionette';
import _ from 'underscore';

export const TableRowView = Marionette.View.extend({
  tagName: 'tr',

  events: {
    'click': function() {
      if (this.options.selection) {
        this.options.selection.set(
          this.selectionAttribute(),
          this.model
        );
      }
    }
  },

  initialize: function() {
    if (this.options.selection) {
      this.listenTo(this.options.selection, 'change', this.updateClassName);
    }
  },

  render: function() {
    _(this.options.columns).each(function(column) {
      this.appendSubview(new column.cellView(_.extend({
        model: this.model,
        column: column,
        attributeTranslationKeyPrefixes: this.options.attributeTranslationKeyPrefixes
      }, column.cellViewOptions || {})));
    }, this);

    this.updateClassName();

    return this;
  },

  updateClassName: function() {
    this.$el.toggleClass('is_selected', this.isSelected());
  },

  isSelected: function() {
    return this.options.selection &&
      this.options.selection.get(this.selectionAttribute()) === this.model;
  },

  selectionAttribute: function() {
    return this.options.selectionAttribute || 'current';
  }
});