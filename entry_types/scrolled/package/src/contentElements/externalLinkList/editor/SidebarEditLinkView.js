import {ConfigurationEditorView, ColorInputView, SeparatorView} from 'pageflow/ui';
import {editor, FileInputView, InfoBoxView} from 'pageflow/editor';
import {InlineFileRightsMenuItem} from 'pageflow-scrolled/editor';
import Marionette from 'backbone.marionette';
import I18n from 'i18n-js';


export const SidebarEditLinkView = Marionette.Layout.extend({
  template: (data) => `
    <a class="back">${I18n.t('pageflow_scrolled.editor.content_elements.externalLinkList.back')}</a>
    <a class="destroy">${I18n.t('pageflow_scrolled.editor.content_elements.externalLinkList.destroy')}</a>

    <div class='form_container'></div>
  `,
  className: 'edit_external_link',
  regions: {
    formContainer: '.form_container',
  },
  events: {
    'click a.back': 'goBack',
    'click a.destroy': 'destroyLink'
  },
  initialize: function(options) {},
  onRender: function () {
    var configurationEditor = new ConfigurationEditorView({
      model: this.model,
      attributeTranslationKeyPrefixes: ['pageflow_scrolled.editor.content_elements.externalLinkList.attributes'],
      tabTranslationKeyPrefix: 'pageflow_scrolled.editor.content_elements.externalLinkList.tabs'
    });
    var self = this;
    var thumbnailAspectRatio = this.options.contentElement.configuration.get('thumbnailAspectRatio');
    var previewAspectRatio = this.options.entry.getAspectRatio(thumbnailAspectRatio)
    var thumbnailFit = this.options.contentElement.configuration.get('thumbnailFit');

    configurationEditor.tab('edit_link', function () {
      this.input('thumbnail', FileInputView, {
        collection: 'image_files',
        fileSelectionHandler: 'contentElement.externalLinks.link',
        fileSelectionHandlerOptions: {
          contentElementId: self.options.contentElement.get('id')
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
    this.formContainer.show(configurationEditor);
  },
  goBack: function() {
    this.options.contentElement.postCommand({type: 'SET_SELECTED_ITEM',
                                             index: -1});

    editor.navigate(`/scrolled/content_elements/${this.options.contentElement.get('id')}`, {trigger: true});
  },
  destroyLink: function () {
    if (window.confirm(I18n.t('pageflow_scrolled.editor.content_elements.externalLinkList.confirm_delete_item'))) {
      this.options.collection.remove(this.model);
      this.goBack();
    }
  },
});
