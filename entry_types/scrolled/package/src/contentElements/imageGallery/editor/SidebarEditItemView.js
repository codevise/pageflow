import {EditConfigurationView, DestroyMenuItem, FileInputView} from 'pageflow/editor';

export const SidebarEditItemView = EditConfigurationView.extend({
  translationKeyPrefix: 'pageflow_scrolled.editor.content_elements.imageGallery.edit_item',

  destroyEvent: 'remove',

  getConfigurationModel() {
    return this.model;
  },

  goBackPath() {
    return `/scrolled/content_elements/${this.options.contentElement.get('id')}`;
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
        fileSelectionHandler: 'imageGalleryItem',
        fileSelectionHandlerOptions: {
          contentElementId: contentElement.get('id')
        },
        positioning: false
      });
      this.input('portraitImage', FileInputView, {
        collection: 'image_files',
        fileSelectionHandler: 'imageGalleryItem',
        fileSelectionHandlerOptions: {
          contentElementId: contentElement.get('id')
        },
        positioning: false
      });
    });
  }
});

const DestroyItemMenuItem = DestroyMenuItem.extend({
  translationKeyPrefix: 'pageflow_scrolled.editor.content_elements.imageGallery.edit_item',

  destroyModel() {
    this.options.collection.remove(this.options.model);
  }
});
