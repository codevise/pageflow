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

    const contentElementType =
      this.editor.contentElementTypes.findByTypeName(this.contentElement.get('typeName'));

    this.set('label', I18n.t(
      contentElementType.handleMove ?
        'pageflow_scrolled.editor.content_element_menu_items.move_selection' :
        'pageflow_scrolled.editor.content_element_menu_items.move'
    ));
  },

  selected() {
    const contentElement = this.contentElement;
    const entry = this.entry;
    const contentElementType =
      this.editor.contentElementTypes.findByTypeName(contentElement.get('typeName'));

    SelectMoveDestinationDialogView.show({
      entry,
      mode: 'sectionPart',
      onSelect: ({section: targetSection, part}) => {
        const to = getTo(targetSection, part);

        if (!to) {
          return;
        }

        if (contentElementType.handleMove) {
          contentElementType.handleMove(contentElement, to);
        }
        else {
          entry.moveContentElement({id: contentElement.id}, to, {
            success() {
              entry.trigger('scrollToSection', targetSection, {
                align: part === 'beginning' ? 'nearStart' : 'nearEnd'
              });
            }
          });
        }
      }
    });
  }
});

function getTo(targetSection, part) {
  if (part === 'beginning') {
    const firstContentElement = targetSection.contentElements.first();
    return firstContentElement && {at: 'before', id: firstContentElement.id};
  }
  else {
    const lastContentElement = targetSection.contentElements.last();
    return lastContentElement && {at: 'after', id: lastContentElement.id};
  }
}
