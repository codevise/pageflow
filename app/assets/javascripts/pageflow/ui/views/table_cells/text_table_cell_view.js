/**
 * A table cell using the row model's value of the column attribute as
 * text.
 *
 * @since edge
 */
pageflow.TextTableCellView = pageflow.TableCellView.extend({
  className: 'text_table_cell',

  update: function() {
    this.$el.text(this.attributeValue() || this.options.column.default);
  }
});
