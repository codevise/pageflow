import Backbone from 'backbone';
import I18n from 'i18n-js';
import {DestroyMenuItem} from 'pageflow/editor';

import {SelectMoveDestinationDialogView} from '../views/SelectMoveDestinationDialogView';

export const DuplicateContentElementMenuItem = Backbone.Model.extend({
  initialize(attributes, options) {
    this.contentElement = options.contentElement;
    this.entry = options.entry;
    this.editor = options.editor;

    const contentElementType =
      this.editor.contentElementTypes.findByTypeName(this.contentElement.get('typeName'));

    this.set('label', I18n.t(
      contentElementType.handleDuplicate ?
        'pageflow_scrolled.editor.duplicate_content_element_menu_item.selection_label' :
        'pageflow_scrolled.editor.duplicate_content_element_menu_item.label'
    ));
  },

  selected() {
    const contentElementType =
      this.editor.contentElementTypes.findByTypeName(this.contentElement.get('typeName'));

    if (contentElementType.handleDuplicate) {
      contentElementType.handleDuplicate(this.contentElement);
    }
    else {
      this.entry.duplicateContentElement(this.contentElement);
    }
  }
});

export const DestroyContentElementMenuItem = DestroyMenuItem.extend({
  translationKeyPrefix: 'pageflow_scrolled.editor.destroy_content_element_menu_item',

  initialize(attributes, options) {
    this.contentElement = options.contentElement;
    this.entry = options.entry;
    this.editor = options.editor;

    DestroyMenuItem.prototype.initialize.call(this, attributes, options);

    const contentElementType =
      this.editor.contentElementTypes.findByTypeName(this.contentElement.get('typeName'));

    if (contentElementType.handleDestroy) {
      this.set('label', I18n.t(
        'pageflow_scrolled.editor.destroy_content_element_menu_item.selection_label'
      ));
    }
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

export const MoveContentElementMenuItem = Backbone.Model.extend({
  initialize(attributes, options) {
    this.contentElement = options.contentElement;
    this.entry = options.entry;
    this.editor = options.editor;
    this.set('label', I18n.t('pageflow_scrolled.editor.content_element_menu_items.move'));
  },

  selected() {
    const contentElement = this.contentElement;
    const entry = this.entry;

    SelectMoveDestinationDialogView.show({
      entry,
      mode: 'sectionPart',
      onSelect: ({section: targetSection, part}) => {
        if (part === 'beginning') {
          const firstContentElement = targetSection.contentElements.first();

          if (firstContentElement) {
            entry.moveContentElement(
              {id: contentElement.id},
              {at: 'before', id: firstContentElement.id}
            );
          }
        }
        else {
          const lastContentElement = targetSection.contentElements.last();

          if (lastContentElement) {
            entry.moveContentElement(
              {id: contentElement.id},
              {at: 'after', id: lastContentElement.id}
            );
          }
        }
      }
    });
  }
});
