import I18n from 'i18n-js';

import {TableCellView} from './TableCellView';

/**
 * A table cell using the row model's value of the column attribute as
 * text. If attribute value is empty, use most specific default
 * available.
 *
 * @param {Object} [options]
 *
 * @param {function|string} [options.column.default]
 *   A function returning a default value for display if attribute
 *   value is empty.
 *
 * @param {string} [options.column.contentBinding]
 *   If this is provided, the function `options.column.default`
 *   receives the values of `options.column.contentBinding` and of
 *   this.getModel() via its options hash. No-op if
 *   `options.column.default` is not a function.
 *
 * @since 12.0
 */
export const TextTableCellView = TableCellView.extend({
  className: 'text_table_cell',

  update: function() {
    this.$el.text(this._updateText());
  },

  _updateText: function() {
    if (this.attributeValue()) {
      return this.attributeValue();
    }
    else if (typeof this.options.column.default === 'function') {
      var options = {};
      if (this.options.column.contentBinding) {
        options = {
          contentBinding: this.options.column.contentBinding,
          model: this.getModel()
        };
      }
      return this.options.column.default(options);
    }
    else if ('default' in this.options.column) {
      return this.options.column.default;
    }
    else {
      return I18n.t('pageflow.ui.text_table_cell_view.empty');
    }
  }
});
