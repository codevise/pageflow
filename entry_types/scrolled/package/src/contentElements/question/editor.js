import {editor} from 'pageflow-scrolled/editor';
import {CheckBoxInputView} from 'pageflow/ui';

import pictogram from './pictogram.svg';

editor.contentElementTypes.register('question', {
  pictogram,
  supportedPositions: ['inline'],

  configurationEditor({entry, contentElement}) {
    this.tab('general', function() {
      const modelDelegator = entry.createLegacyTypographyVariantDelegator({
        model: this.model,
        paletteColorPropertyName: 'color'
      });

      this.group('ContentElementTypographyVariant', {
        entry,
        model: modelDelegator,
        getPreviewConfiguration: (configuration, typographyVariant) =>
          ({
            ...configuration,
            expandByDefault: true,
            typographyVariant
          })
      });
      this.group('ContentElementTypographySize', {
        entry,
        model: modelDelegator,
        getPreviewConfiguration: (configuration, typographySize) =>
          ({
            ...configuration,
            expandByDefault: true,
            // Ensure size in preview is not overridden by legacy variant
            typographyVariant: modelDelegator.get('typographyVariant'),
            typographySize
          })
      });
      this.group('PaletteColor', {
        entry,
        propertyName: 'color'
      });
      this.group('PaletteColor', {
        entry,
        propertyName: 'answerColor'
      });
      this.input('expandByDefault', CheckBoxInputView);
    });
  },
});
