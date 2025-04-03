import {ConfigurationEditorView} from 'pageflow/ui';
import {editor, FileInputView} from 'pageflow/editor';
import Marionette from 'backbone.marionette';
import I18n from 'i18n-js';

export const SidebarEditItemView = Marionette.Layout.extend({
  template: (data) => `
    <a class="back">${I18n.t('pageflow_scrolled.editor.content_elements.imageGallery.edit_item.back')}</a>
    <a class="destroy">${I18n.t('pageflow_scrolled.editor.content_elements.imageGallery.edit_item.destroy')}</a>

    <div class='form_container'></div>
  `,

  regions: {
    formContainer: '.form_container',
  },

  events: {
    'click a.back': 'goBack',
    'click a.destroy': 'destroyLink'
  },

  onRender: function () {
    const options = this.options;

    const configurationEditor = new ConfigurationEditorView({
      model: this.model,
      attributeTranslationKeyPrefixes: ['pageflow_scrolled.editor.content_elements.imageGallery.edit_item.attributes'],
      tabTranslationKeyPrefix: 'pageflow_scrolled.editor.content_elements.imageGallery.edit_item.tabs',
    });

    configurationEditor.tab('item', function() {
      this.input('image', FileInputView, {
        collection: 'image_files',
        fileSelectionHandler: 'imageGalleryItem',
        fileSelectionHandlerOptions: {
          contentElementId: options.contentElement.get('id')
        },
        positioning: false
      });
      this.input('portraitImage', FileInputView, {
        collection: 'image_files',
        fileSelectionHandler: 'imageGalleryItem',
        fileSelectionHandlerOptions: {
          contentElementId: options.contentElement.get('id')
        },
        positioning: false
      });
    });

    this.formContainer.show(configurationEditor);
  },

  goBack: function() {
    editor.navigate(`/scrolled/content_elements/${this.options.contentElement.get('id')}`, {trigger: true});
  },

  destroyLink: function () {
    if (window.confirm(I18n.t('pageflow_scrolled.editor.content_elements.imageGallery.edit_item.confirm_delete_link'))) {
      this.options.collection.remove(this.model);
      this.goBack();
    }
  }
});
