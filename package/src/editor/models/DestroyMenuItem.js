import Backbone from 'backbone';
import I18n from 'i18n-js';

/**
 * A menu item that shows a confirmation dialog before calling a
 * destroy callback.
 *
 * @param {Object} attributes
 * @param {boolean} [attributes.separated] - Display separator above item.
 *
 * @param {Object} options
 * @param {Backbone.Model} [options.destroyedModel] - Model to destroy.
 *   Override `destroyModel` method for custom behavior.
 *
 * Set `translationKeyPrefix` to provide `destroy` and `confirm_destroy`
 * translations.
 *
 * @since edge
 */
export const DestroyMenuItem = Backbone.Model.extend({
  translationKeyPrefix: 'pageflow.editor.destroy_menu_item',

  defaults: {
    name: 'destroy',
    destructive: true
  },

  initialize(attributes, options) {
    this.options = options || {};

    this.set('label', I18n.t(`${this.translationKeyPrefix}.destroy`));
    this.set('confirmMessage', I18n.t(`${this.translationKeyPrefix}.confirm_destroy`));
  },

  selected() {
    if (window.confirm(this.get('confirmMessage'))) {
      this.destroyModel();
    }
  },

  destroyModel() {
    this.options.destroyedModel?.destroyWithDelay();
  }
});
