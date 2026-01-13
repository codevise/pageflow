import Backbone from 'backbone';
import I18n from 'i18n-js';
import {DestroyMenuItem} from 'pageflow/editor';

export const DuplicateContentElementMenuItem = Backbone.Model.extend({
  initialize(attributes, options) {
    this.contentElement = options.contentElement;
    this.entry = options.entry;
    this.set('label', I18n.t('pageflow_scrolled.editor.duplicate_content_element_menu_item.label'));
  },

  selected() {
    this.entry.duplicateContentElement(this.contentElement);
  }
});

export const DestroyContentElementMenuItem = DestroyMenuItem.extend({
  translationKeyPrefix: 'pageflow_scrolled.editor.destroy_content_element_menu_item',

  initialize(attributes, options) {
    this.contentElement = options.contentElement;
    this.entry = options.entry;
    this.editor = options.editor;

    DestroyMenuItem.prototype.initialize.call(this, attributes, options);
  },

  destroyModel() {
    const contentElementType =
      this.editor.contentElementTypes.findByTypeName(this.contentElement.get('typeName'));

    if (contentElementType.handleDestroy) {
      const result = contentElementType.handleDestroy(this.contentElement);

      if (result === false) {
        return false;
      }
    }

    this.entry.deleteContentElement(this.contentElement);
  }
});
