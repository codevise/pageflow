import Marionette from 'backbone.marionette';
import _ from 'underscore';

import {findTranslation} from '../../utils/i18nUtils';

import template from '../../templates/tableCells/tableCell.jst';

/**
 * Base class for table cell views.
 *
 * Inside sub classes the name of the column options are available as
 * `this.options.column`. Override the `update` method to populate the
 * element.
 *
 * @param {Object} [options]
 *
 * @param {string} [options.className]
 *   Class attribute to apply to the cell element.
 *
 * @since 12.0
 */
export const TableCellView = Marionette.ItemView.extend({
  tagName: 'td',
  template,

  className: function() {
    return this.options.className;
  },

  onRender: function() {
    this.listenTo(this.getModel(), 'change:' + this.options.column.name, this.update);
    this.setupContentBinding();
    this.update();
  },

  /**
   * Override in concrete cell view.
   */
  update: function() {
    throw 'Not implemented';
  },

  /**
   * Returns the column attribute's value in the row model.
   */
  attributeValue: function() {
    if (typeof this.options.column.value == 'function') {
      return this.options.column.value(this.model);
    }
    else {
      return this.getModel().get(this.options.column.name);
    }
  },

  getModel: function() {
    if (this.options.column.configurationAttribute) {
      return this.model.configuration;
    }
    else {
      return this.model;
    }
  },

  /**
   * Look up attribute specific translations based on
   * `attributeTranslationKeyPrefixes` of the the parent `TableView`.
   *
   * @param {Object} [options]
   *   Interpolations to apply to the translation.
   *
   * @param {string} [options.defaultValue]
   *   Fallback value if no translation is found.
   *
   * @protected
   *
   * @example
   *
   * this.attribute.attributeTranslation("cell_title");
   * // Looks for keys of the form:
   * // <table_view_translation_key_prefix>.<column_attribute>.cell_title
   */
  attributeTranslation: function(keyName, options) {
    return findTranslation(
      this.attributeTranslationKeys(keyName),
      options
    );
  },

  attributeTranslationKeys: function(keyName) {
    return _(this.options.attributeTranslationKeyPrefixes || []).map(function(prefix) {
      return prefix + '.' + this.options.column.name + '.' + keyName;
    }, this);
  },

  /**
   * Set up content binding to update this view upon change of
   * specified attribute on this.getModel().
   *
   * @param {string} [options.column.contentBinding]
   *   Name of the attribute to which this cell's update is bound
   *
   * @protected
   */
  setupContentBinding: function() {
    if (this.options.column.contentBinding) {
      this.listenTo(this.getModel(), 'change:' + this.options.column.contentBinding, this.update);
      this.update();
    }
  }
});
