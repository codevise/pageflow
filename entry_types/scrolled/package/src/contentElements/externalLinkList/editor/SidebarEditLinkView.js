import {ColorInputView, SeparatorView} from 'pageflow/ui';
import {EditConfigurationView, DestroyMenuItem, FileInputView, InfoBoxView} from 'pageflow/editor';
import {InlineFileRightsMenuItem} from 'pageflow-scrolled/editor';
import I18n from 'i18n-js';

export const SidebarEditLinkView = EditConfigurationView.extend({
  translationKeyPrefix: 'pageflow_scrolled.editor.content_elements.externalLinkList',

  destroyEvent: 'remove',

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
    return [new DestroyLinkMenuItem({}, {
      collection: this.options.collection,
      model: this.model
    })];
  },

  configure(configurationEditor) {
    const contentElement = this.options.contentElement;
    const thumbnailAspectRatio = contentElement.configuration.get('thumbnailAspectRatio');
    const previewAspectRatio = this.options.entry.getAspectRatio(thumbnailAspectRatio);
    const thumbnailFit = contentElement.configuration.get('thumbnailFit');

    configurationEditor.tab('edit_link', function() {
      this.input('thumbnail', FileInputView, {
        collection: 'image_files',
        fileSelectionHandler: 'contentElement.externalLinks.link',
        fileSelectionHandlerOptions: {
          contentElementId: contentElement.get('id')
        },
        positioning: previewAspectRatio && thumbnailFit !== 'contain',
        positioningOptions: {
          preview: previewAspectRatio && (1 / previewAspectRatio)
        },
        dropDownMenuItems: [InlineFileRightsMenuItem]
      });

      this.input('thumbnailBackgroundColor', ColorInputView);

      this.view(SeparatorView);

      this.view(InfoBoxView, {
        text: I18n.t(
          'pageflow_scrolled.editor.content_elements.textBlock.help_texts.shortcuts'
        ),
      });
    });
  }
});

const DestroyLinkMenuItem = DestroyMenuItem.extend({
  translationKeyPrefix: 'pageflow_scrolled.editor.content_elements.externalLinkList',

  destroyModel() {
    this.options.collection.remove(this.options.model);
  }
});
