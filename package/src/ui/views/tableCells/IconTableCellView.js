import {TableCellView} from './TableCellView';

/**
 * A table cell mapping column attribute values to icons.
 *
 * ## Attribute Translations
 *
 * The following attribute translations are used:
 *
 * - `.cell_title.<attribute_value>` - Used as title attribute.
 * - `.cell_title.blank` - Used as title attribute if attribute is blank.
 *
 * @param {Object} [options]
 *
 * @param {string[]} [options.icons]
 *   An array of all possible attribute values to be mapped to HTML
 *   classes of the same name. A global mapping from those classes to
 *   icon mixins is provided in
 *   pageflow/ui/table_cells/icon_table_cell.scss.
 *
 * @since 12.0
 */
export const IconTableCellView = TableCellView.extend({
  className: 'icon_table_cell',

  update: function() {
    var icon = this.attributeValue();
    var isPresent = !!this.attributeValue();

    this.removeExistingIcons();

    this.$el.attr('title',
                  isPresent ?
                  this.attributeTranslation('cell_title.' + icon, {
                    value: this.attributeValue()
                  }) :
                  this.attributeTranslation('cell_title.blank'));
    this.$el.addClass(icon);
  },

  removeExistingIcons: function() {
    this.$el.removeClass(this.options.icons.join(' '));
  }
});
