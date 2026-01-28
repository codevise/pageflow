import {features} from 'pageflow/frontend';

import {
  ConfigurationEditorTabView,
  CheckBoxInputView,
  SelectInputView,
  SliderInputView
} from 'pageflow/ui';

import {
  TypographyVariantSelectInputView
} from '../../inputs/TypographyVariantSelectInputView';

import {
  ColorSelectOrCustomColorInputView
} from '../../inputs/ColorSelectOrCustomColorInputView';

import {
  ColorSelectInputView
} from '../../inputs/ColorSelectInputView';

import {
  PositionSelectInputView
} from '../../inputs/PositionSelectInputView';

ConfigurationEditorTabView.groups.define('ContentElementPosition', function({entry}) {
  const contentElement = this.model.parent;

  if (contentElement.getAvailablePositions().length > 1) {
    this.input('position', PositionSelectInputView, {
      attributeTranslationKeyPrefixes: ['pageflow_scrolled.editor.common_content_element_attributes'],
      values: contentElement.getAvailablePositions(),
      sectionLayout: this.model.parent.section.configuration.get('layout')
    });
  }

  this.input('width', SliderInputView, {
    attributeTranslationKeyPrefixes: ['pageflow_scrolled.editor.common_content_element_attributes'],
    displayText: value => [
      'XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL'
    ][value + 3],
    saveOnSlide: true,
    minValueBinding: 'position',
    maxValueBinding: 'position',
    visibleBinding: 'position',
    minValue: () => contentElement.getAvailableMinWidth(),
    maxValue: () => contentElement.getAvailableMaxWidth(),
    visible: () => contentElement.getAvailableMinWidth() !== contentElement.getAvailableMaxWidth(),

    defaultValue:
      this.model.get('position') === 'wide' ? 2 :
      this.model.get('position') === 'full' ? 3 :
      0
  });

  this.input('alignment', SelectInputView, {
    attributeTranslationKeyPrefixes: ['pageflow_scrolled.editor.common_content_element_attributes'],
    values: ['center', 'left', 'right'],
    defaultValue: 'center',
    visibleBinding: ['position', 'width'],
    visible: () => (
      ['inline', 'standAlone'].includes(contentElement.getResolvedPosition()) &&
      contentElement.getWidth() < 0
    )
  });

  if (contentElement.supportsFullWidthInPhoneLayout()) {
    this.input('fullWidthInPhoneLayout', CheckBoxInputView, {
      attributeTranslationKeyPrefixes: ['pageflow_scrolled.editor.common_content_element_attributes'],
      disabledBinding: 'width',
      disabled: () => contentElement.getWidth() === 3,
      displayCheckedIfDisabled: true,
      visibleBinding: 'position',
      visible: () => contentElement.getPosition() !== 'backdrop'
    });
  }

  if (features.isEnabled('content_element_margins')) {
    const marginScale = entry.getScale('contentElementMargin');

    this.input('marginTop', SelectInputView, {
      attributeTranslationKeyPrefixes: ['pageflow_scrolled.editor.common_content_element_attributes'],
      includeBlank: true,
      values: marginScale.values,
      texts: marginScale.texts
    });
    this.input('marginBottom', SelectInputView, {
      attributeTranslationKeyPrefixes: ['pageflow_scrolled.editor.common_content_element_attributes'],
      includeBlank: true,
      values: marginScale.values,
      texts: marginScale.texts
    });
  }
});

ConfigurationEditorTabView.groups.define(
  'ContentElementTypographyVariant',
  function({entry, model, prefix, getPreviewConfiguration}) {
    const contentElement = this.model.parent;

    if (entry.getTypographyVariants({contentElement})[0].length) {
      const [variants, texts] = entry.getTypographyVariants({
        contentElement,
        prefix
      });

      this.input('typographyVariant', TypographyVariantSelectInputView, {
        entry,
        model: model || this.model,
        contentElement: contentElement,
        prefix,
        getPreviewConfiguration,

        includeBlank: true,
        blankTranslationKey: 'pageflow_scrolled.editor.' +
                             'common_content_element_attributes.' +
                             'typographyVariant.blank',
        attributeTranslationKeyPrefixes: [
          'pageflow_scrolled.editor.common_content_element_attributes'
        ],
        disabled: !variants.length,

        values: variants,
        texts,
      });
    }
  }
);

ConfigurationEditorTabView.groups.define(
  'ContentElementTypographySize',
  function({entry, model, prefix, getPreviewConfiguration}) {
    const contentElement = this.model.parent;

    const [sizes, texts] = entry.getTypographySizes({
      contentElement,
      prefix
    });

    this.input('typographySize', TypographyVariantSelectInputView, {
      entry,
      model: model || this.model,
      contentElement,
      prefix,
      getPreviewConfiguration,

      attributeTranslationKeyPrefixes: [
        'pageflow_scrolled.editor.common_content_element_attributes'
      ],
      disabled: sizes.length <= 1,

      defaultValue: 'md',
      values: sizes,
      texts,
    });
  }
);

ConfigurationEditorTabView.groups.define(
  'ContentElementVariant',
  function({entry}) {
    const [variants, texts] = entry.getContentElementVariants({
      contentElement: this.model.parent
    });

    if (variants.length) {
      this.input('variant', SelectInputView, {
        attributeTranslationKeyPrefixes: [
          'pageflow_scrolled.editor.common_content_element_attributes'
        ],
        includeBlank: true,
        blankTranslationKey: 'pageflow_scrolled.editor.' +
                             'common_content_element_attributes.' +
                             'variant.blank',
        values: variants,
        texts,
      });
    }
  }
);

ConfigurationEditorTabView.groups.define(
  'PaletteColor',
  function({propertyName, entry, model, visibleBinding, visible}) {
    const [values, texts] = entry.getPaletteColors();
    const inputView = features.isEnabled('custom_palette_colors') ?
                      ColorSelectOrCustomColorInputView :
                      ColorSelectInputView;

    if (values.length) {
      this.input(propertyName, inputView, {
        model: model || this.model,
        includeBlank: true,
        blankTranslationKey: 'pageflow_scrolled.editor.' +
                             'common_content_element_attributes.' +
                             'palette_color.blank',
        customColorTranslationKey: 'pageflow_scrolled.editor.' +
                                   'common_content_element_attributes.' +
                                   'palette_color.custom',
        values,
        texts,
        visibleBinding,
        visible: visible || true
      });
    }
  }
);

ConfigurationEditorTabView.groups.define(
  'ContentElementCaption',
  function({entry, disableWhenNoCaption = true}) {
    const [variants, texts] = entry.getComponentVariants({
      name: 'figureCaption'
    });

    if (variants.length) {
      this.input('captionVariant', SelectInputView, {
        attributeTranslationKeyPrefixes: [
          'pageflow_scrolled.editor.common_content_element_attributes'
        ],
        includeBlank: true,
        blankTranslationKey: 'pageflow_scrolled.editor.' +
                             'common_content_element_attributes.' +
                             'captionVariant.blank',
        values: variants,
        texts,
        disabledBindingModel: this.model.parent.transientState,
        disabledBinding: 'hasCaption',
        disabled: hasCaption => disableWhenNoCaption && !hasCaption
      });
    }
  }
);
