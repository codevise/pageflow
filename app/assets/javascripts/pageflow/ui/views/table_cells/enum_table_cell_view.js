/**
 * A table cell mapping column attribute values to a list of
 * translations.
 *
 * ## Attribute Translations
 *
 * The following attribute translations are used:
 *
 * - `.cell_text.<attribute_value>` - Used as cell content.
 * - `.cell_text.blank` - Used as cell content if attribute is blank.
 * - `.cell_title.<attribute_value>` - Used as title attribute.
 * - `.cell_title.blank` - Used as title attribute if attribute is blank.
 *
 * @since edge
 */
pageflow.EnumTableCellView = pageflow.TableCellView.extend({
  className: 'enum_table_cell',

  update: function() {
    this.$el.text(this.attributeTranslation('cell_text.' + (this.attributeValue() || 'blank')));
    this.$el.attr('title',
                  this.attributeTranslation('cell_title.' + (this.attributeValue() || 'blank'), {
                    defaultValue: ''
                  }));
  }
});
