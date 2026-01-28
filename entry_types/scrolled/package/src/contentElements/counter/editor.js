import {editor} from 'pageflow-scrolled/editor';
import {
  CheckBoxInputView, SelectInputView, SliderInputView, TextInputView, NumberInputView, SeparatorView
} from 'pageflow/ui';

import pictogram from './pictogram.svg';

editor.contentElementTypes.register('counter', {
  category: 'data',
  pictogram,
  supportedPositions: ['inline', 'side', 'sticky', 'standAlone', 'left', 'right'],
  supportedWidthRange: ['xxs', 'full'],

  defaultConfig: {
    targetValue: 100,
    countingSpeed: 'medium',
    numberSize: 'md',
    unitSize: 'md',
    descriptionSize: 'md'
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
      this.input('thousandsSeparators', CheckBoxInputView, {
        storeInverted: 'hideThousandsSeparators'
      });
      this.input('unit', TextInputView);
      this.input('unitPlacement', SelectInputView, {
        values: ['trailing', 'leading'],
      });
      this.view(SeparatorView);
      const [numberSizes, numberTexts] = entry.getTypographySizes({
        scaleCategory: 'counterNumber',
        texts: 'short',
        order: 'asc'
      });
      this.input('numberSize', SliderInputView, {
        values: numberSizes,
        texts: numberTexts,
        defaultValue: 'md',
        saveOnSlide: true
      });
      const [unitSizes, unitTexts] = entry.getTypographySizes({
        scaleCategory: 'counterUnit',
        texts: 'short',
        order: 'asc'
      });
      this.input('unitSize', SliderInputView, {
        values: unitSizes,
        texts: unitTexts,
        defaultValue: 'md',
        saveOnSlide: true,
        visibleBinding: 'unit',
        visible: unit => !!unit
      });
      const [descriptionSizes, descriptionTexts] = entry.getTypographySizes({
        scaleCategory: 'counterDescription',
        texts: 'short',
        order: 'asc'
      });
      this.input('descriptionSize', SliderInputView, {
        values: descriptionSizes,
        texts: descriptionTexts,
        defaultValue: 'md',
        saveOnSlide: true
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
      this.input('startAnimationTrigger', SelectInputView, {
        values: ['onActivate', 'onVisible'],
        visibleBinding: ['entranceAnimation', 'countingSpeed'],
        visible: ([entranceAnimation, countingSpeed]) =>
          (entranceAnimation || 'none') !== 'none' || countingSpeed !== 'none'
      });
      this.group('ContentElementTypographyVariant', {
        entry,
        getPreviewConfiguration: (configuration, typographyVariant) =>
          ({
            ...configuration,
            typographyVariant,
            entranceAnimation: 'none',
            countingSpeed: 'none',
            numberSize: 'sm',
            position: 'inline'
          })
      });
      this.group('PaletteColor', {
        propertyName: 'numberColor',
        entry
      });
      this.group('ContentElementPosition', {entry});
    });
  }
});
