import {SelectInputView, SliderInputView, SeparatorView} from 'pageflow/ui';
import {EditConfigurationView, DestroyMenuItem, FileInputView} from 'pageflow/editor';

import {AreaInputView} from './AreaInputView';

import styles from './SidebarEditAreaView.module.css';

export const SidebarEditAreaView = EditConfigurationView.extend({
  translationKeyPrefix: 'pageflow_scrolled.editor.content_elements.hotspots.edit_area',

  className: 'edit_configuration_view ' + styles.view,

  destroyEvent: 'remove',

  getConfigurationModel() {
    return this.model;
  },

  defaultTab() {
    return this.options.tab ||
           (this.options.entry.get('emulation_mode') === 'phone' ? 'portrait' : 'area');
  },

  goBackPath() {
    return `/scrolled/content_elements/${this.options.contentElement.get('id')}`;
  },

  getActionsMenuItems() {
    return [new DestroyAreaMenuItem({}, {
      collection: this.options.collection,
      model: this.model
    })];
  },

  configure(configurationEditor) {
    const options = this.options;
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
  }
});

const DestroyAreaMenuItem = DestroyMenuItem.extend({
  translationKeyPrefix: 'pageflow_scrolled.editor.content_elements.hotspots.edit_area',

  destroyModel() {
    this.options.collection.remove(this.options.model);
  }
});
