import I18n from 'i18n-js';
import {editor} from 'pageflow-scrolled/editor';
import {contentElementWidths} from 'pageflow-scrolled/frontend';
import {SelectInputView, SeparatorView} from 'pageflow/ui';
import {InfoBoxView} from 'pageflow/editor';

import pictogram from './pictogram.svg';

editor.contentElementTypes.register('heading', {
  pictogram,
  supportedPositions: ['inline'],
  supportedWidthRange: ['md', 'xl'],

  defaultConfig: {width: contentElementWidths.xl, marginTop: 'none'},

  configurationEditor({entry}) {
    this.listenTo(this.model, 'change:hyphens', this.refresh);

    const modelDelegator = entry.createLegacyTypographyVariantDelegator({
      model: this.model,
      paletteColorPropertyName: 'color'
    });

    this.tab('general', function() {
      this.group('ContentElementTypographyVariant', {
        entry,
        model: modelDelegator,
        getPreviewConfiguration: (configuration, typographyVariant) =>
          ({
            ...configuration,
            textSize: 'small',
            typographyVariant
          })
      });
      this.input('textSize', SelectInputView, {
        values: ['auto', 'large', 'medium', 'small']
      });
      this.group('PaletteColor', {
        entry,
        model: modelDelegator,
        propertyName: 'color'
      });
      this.input('entranceAnimation', SelectInputView, {
        values: ['none', 'fadeInSlow', 'fadeIn',  'fadeInFast'],
      });

      this.input('hyphens', SelectInputView, {
        values: ['auto', 'manual']
      });

      if (this.model.get('hyphens') === 'manual') {
        this.view(InfoBoxView, {
          text: I18n.t('pageflow_scrolled.editor.content_elements.heading.help_texts.shortcuts'),
        });
      }

      this.view(SeparatorView);
      this.group('ContentElementPosition', {entry});
    });
  }
});
