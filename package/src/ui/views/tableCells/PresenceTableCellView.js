import {TableCellView} from './TableCellView';

/**
 * A table cell representing whether the column attribute is present
 * on the row model.
 *
 * ## Attribute Translations
 *
 * The following attribute translations are used:
 *
 * - `.cell_title.present` - Used as title attribute if the attribute
 *   is present. The current attribute value is provided as
 *   interpolation `%{value}`.
 * - `.cell_title.blank` - Used as title attribute if the
 *   attribute is blank.
 *
 * @since 12.0
 */
export const PresenceTableCellView = TableCellView.extend({
  className: 'presence_table_cell',

  update: function() {
    var isPresent = !!this.attributeValue();

    this.$el.attr('title',
                  isPresent ?
                  this.attributeTranslation('cell_title.present', {
                    value: this.attributeValue()
                  }) :
                  this.attributeTranslation('cell_title.blank'));
    this.$el.toggleClass('is_present', isPresent);
  }
});
