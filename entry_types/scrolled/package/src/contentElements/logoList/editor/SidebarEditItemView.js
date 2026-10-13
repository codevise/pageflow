import {EditConfigurationView, DestroyMenuItem, FileInputView} from 'pageflow/editor';
import {TextInputView} from 'pageflow/ui';

export const SidebarEditItemView = EditConfigurationView.extend({
  translationKeyPrefix: 'pageflow_scrolled.editor.content_elements.logoList.edit_item',

  containingCollection() {
    return this.options.collection;
  },

  getConfigurationModel() {
    return this.model;
  },

  goBackPath() {
    return `/scrolled/content_elements/${this.options.contentElement.get('id')}`;
  },

  goBack() {
    this.options.contentElement.postCommand({type: 'SET_SELECTED_ITEM', index: -1});
    EditConfigurationView.prototype.goBack.call(this);
  },

  getActionsMenuItems() {
    return [new DestroyItemMenuItem({}, {
      collection: this.options.collection,
      model: this.model
    })];
  },

  configure(configurationEditor) {
    const contentElement = this.options.contentElement;

    configurationEditor.tab('item', function() {
      this.input('image', FileInputView, {
        collection: 'image_files',
        fileSelectionHandler: 'logoListItem',
        fileSelectionHandlerOptions: {
          contentElementId: contentElement.get('id')
        },
        positioning: false
      });
      this.input('alt', TextInputView, {
        placeholderModel: this.model.imageFile()?.configuration
      });
    });
  }
});

const DestroyItemMenuItem = DestroyMenuItem.extend({
  translationKeyPrefix: 'pageflow_scrolled.editor.content_elements.logoList.edit_item',

  destroyModel() {
    this.options.collection.remove(this.options.model);
  }
});
