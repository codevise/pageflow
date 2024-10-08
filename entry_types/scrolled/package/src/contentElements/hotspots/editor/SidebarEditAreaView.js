import {ConfigurationEditorView, SelectInputView, SliderInputView, SeparatorView} from 'pageflow/ui';
import {editor, FileInputView} from 'pageflow/editor';
import Marionette from 'backbone.marionette';
import I18n from 'i18n-js';

import {AreaInputView} from './AreaInputView';

import styles from './SidebarEditAreaView.module.css';

export const SidebarEditAreaView = Marionette.Layout.extend({
  template: (data) => `
    <a class="back">${I18n.t('pageflow_scrolled.editor.content_elements.hotspots.edit_area.back')}</a>
    <a class="destroy">${I18n.t('pageflow_scrolled.editor.content_elements.hotspots.edit_area.destroy')}</a>

    <div class='form_container'></div>
  `,

  className: styles.view,

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
      attributeTranslationKeyPrefixes: ['pageflow_scrolled.editor.content_elements.hotspots.edit_area.attributes'],
      tabTranslationKeyPrefix: 'pageflow_scrolled.editor.content_elements.hotspots.edit_area.tabs',
      tab: options.tab || (options.entry.get('emulation_mode') === 'phone' ? 'portrait' : 'area')
    });

    const file = options.contentElement.configuration.getImageFile('image');
    const portraitFile = options.contentElement.configuration.getImageFile('portraitImage');
    const panZoomEnabled = options.contentElement.configuration.get('enablePanZoom') !== 'never';

    const preserveActiveArea = () => setTimeout(
      () => options.contentElement.postCommand({
        type: 'SET_ACTIVE_AREA',
        index: options.collection.indexOf(this.model)
      }),
      200
    );

    if (file && portraitFile) {
      this.previousEmulationMode = options.entry.get('emulation_mode') || 'desktop';
    }

    configurationEditor.tab('area', function() {
      if (file && portraitFile && options.entry.has('emulation_mode')) {
        options.entry.unset('emulation_mode');
        preserveActiveArea();
      }

      this.input('area', AreaInputView, {
        file,
        portraitFile
      });
      this.input('activeImage', FileInputView, {
        collection: 'image_files',
        fileSelectionHandler: 'hotspotsArea',
        fileSelectionHandlerOptions: {
          contentElementId: options.contentElement.get('id'),
          tab: 'area'
        },
        positioning: false
      });

      if (panZoomEnabled) {
        this.input('zoom', SliderInputView);
      }

      this.group('PaletteColor', {
        propertyName: 'color',
        entry: options.entry
      });
      this.input('tooltipReference', SelectInputView, {
        values: ['indicator', 'area']
      });
      this.input('tooltipPosition', SelectInputView, {
        values: ['below', 'above']
      });
      this.input('tooltipMaxWidth', SelectInputView, {
        defaultValue: 'medium',
        values: ['wide', 'medium', 'narrow', 'veryNarrow']
      });
      this.view(SeparatorView);
      this.input('tooltipImage', FileInputView, {
        collection: 'image_files',
        fileSelectionHandler: 'hotspotsArea',
        fileSelectionHandlerOptions: {
          contentElementId: options.contentElement.get('id'),
          tab: 'area'
        },
        positioning: false
      });
      this.input('tooltipTextAlign', SelectInputView, {
        values: ['left', 'right', 'center']
      });
    });

    if (portraitFile) {
      configurationEditor.tab('portrait', function() {
        if (file && portraitFile && !options.entry.has('emulation_mode')) {
          options.entry.set('emulation_mode', 'phone');
          preserveActiveArea();
        }

        this.input('portraitArea', AreaInputView, {
          file,
          portraitFile,
          defaultTab: 'portrait'
        });
        this.input('portraitActiveImage', FileInputView, {
          collection: 'image_files',
          fileSelectionHandler: 'hotspotsArea',
          fileSelectionHandlerOptions: {
            contentElementId: options.contentElement.get('id'),
            tab: 'portrait'
          },
          positioning: false
        });

        if (panZoomEnabled) {
          this.input('portraitZoom', SliderInputView);
        }

        this.group('PaletteColor', {
          propertyName: 'portraitColor',
          entry: options.entry
        });
        this.input('portraitTooltipReference', SelectInputView, {
          values: ['indicator', 'area']
        });
        this.input('portraitTooltipPosition', SelectInputView, {
          values: ['below', 'above']
        });
        this.input('portraitTooltipMaxWidth', SelectInputView, {
          defaultValue: 'medium',
          values: ['wide', 'medium', 'narrow', 'veryNarrow']
        });
      });
    }

    this.formContainer.show(configurationEditor);
  },

  goBack: function() {
    editor.navigate(`/scrolled/content_elements/${this.options.contentElement.get('id')}`, {trigger: true});
  },

  destroyLink: function () {
    if (window.confirm(I18n.t('pageflow_scrolled.editor.content_elements.hotspots.edit_area.confirm_delete_link'))) {
      this.options.collection.remove(this.model);
      this.goBack();
    }
  },
});
