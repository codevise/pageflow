import {editor} from 'pageflow-scrolled/editor';
import {SelectInputView, TextInputView, NumberInputView, SeparatorView} from 'pageflow/ui';

import pictogram from './pictogram.svg';

editor.contentElementTypes.register('counter', {
  category: 'data',
  pictogram,
  supportedPositions: ['inline', 'sticky', 'left', 'right', 'wide'],

  defaultConfig: {
    targetValue: 100,
    countingSpeed: 'medium',
    textSize: 'medium'
  },

  configurationEditor({entry}) {
    const locale = entry.metadata.get('locale');
    this.tab('general', function() {
      this.input('targetValue', NumberInputView, {locale});
      this.input('decimalPlaces', SelectInputView, {
        values: [0, 1, 2, 3],
        texts: [0, 1, 2, 3].map(i =>
          (0).toLocaleString(locale, {minimumFractionDigits: i})
        )
      });
      this.input('unit', TextInputView);
      this.input('unitPlacement', SelectInputView, {
        values: ['trailing', 'leading'],
      });
      this.view(SeparatorView);
      this.input('entranceAnimation', SelectInputView, {
        values: ['none', 'fadeIn',
                 'fadeInFromBelow', 'fadeInFromAbove',
                 'fadeInScaleUp', 'fadeInScaleDown'],
      });
      this.input('countingSpeed', SelectInputView, {
        values: ['none', 'slow', 'medium', 'fast'],
      });
      this.input('startValue', NumberInputView, {
        locale,
        visibleBinding: 'countingSpeed',
        visible: countingSpeed => countingSpeed !== 'none'
      });
      this.view(SeparatorView);
      this.input('textSize', SelectInputView, {
        values: ['large', 'medium', 'small', 'verySmall']
      });
      this.group('ContentElementTypographyVariant', {
        entry,
        getPreviewConfiguration: (configuration, typographyVariant) =>
          ({
            ...configuration,
            typographyVariant,
            entranceAnimation: 'none',
            countingSpeed: 'none',
            textSize: 'small',
            position: 'inline'
          })
      });
      this.group('PaletteColor', {
        propertyName: 'numberColor',
        entry
      });
      this.group('ContentElementPosition');
    });
  }
});
