pageflow.TableHeaderCellView = pageflow.TableCellView.extend({
  tagName: 'th',

  render: function() {
    this.$el.text(this.attributeTranslation('column_header'));
    return this;
  }
});