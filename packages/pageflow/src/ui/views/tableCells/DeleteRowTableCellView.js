import {TableCellView} from './TableCellView';

import template from '../../templates/tableCells/deleteRowTableCell.jst';

/**
 * A table cell providing a button which destroys the model that the
 * current row refers to.
 *
 * ## Attribute Translations
 *
 * The following attribute translation is used:
 *
 * - `.cell_title` - Used as title attribute.
 *
 * @param {Object} [options]
 *
 * @param {function} [options.toggleDeleteButton]
 *   A function with boolean return value to be called on
 *   this.getModel(). Delete button will be visible only if the
 *   function returns a truthy value.
 *
 * @param {boolean} [options.invertToggleDeleteButton]
 *   Invert the return value of `toggleDeleteButton`?
 *
 * @since 12.0
 */
export const DeleteRowTableCellView = TableCellView.extend({
  className: 'delete_row_table_cell',
  template,

  ui: {
    removeButton: '.remove'
  },

  events: {
    'click .remove': 'destroy',

    'click': function() {
      return false;
    }
  },

  showButton: function() {
    if (this.options.toggleDeleteButton) {
      var context = this.getModel();
      var toggle = context[this.options.toggleDeleteButton].apply(context);

      if (this.options.invertToggleDeleteButton) {
        return !toggle;
      }
      else {
        return !!toggle;
      }
    }
    else {
      return true;
    }
  },

  update: function() {
    this.ui.removeButton.toggleClass('remove', this.showButton());

    this.ui.removeButton.attr('title', this.attributeTranslation('cell_title'));
  },

  destroy: function() {
    this.getModel().destroy();
  }
});
