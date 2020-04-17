import {TableCellView} from './TableCellView';

export const TableHeaderCellView = TableCellView.extend({
  tagName: 'th',

  render: function() {
    this.$el.text(this.attributeTranslation('column_header'));
    this.$el.data('columnName', this.options.column.name);

    return this;
  }
});