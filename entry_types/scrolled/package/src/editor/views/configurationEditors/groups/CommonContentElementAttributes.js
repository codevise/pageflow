import {ConfigurationEditorTabView, SelectInputView, TextInputView} from 'pageflow/ui';

import {
  TypographyVariantSelectInputView
} from '../../inputs/TypographyVariantSelectInputView'

ConfigurationEditorTabView.groups.define('ContentElementPosition', function() {
  const contentElement = this.model.parent;

  this.input('position', SelectInputView, {
    attributeTranslationKeyPrefixes: ['pageflow_scrolled.editor.common_content_element_attributes'],
    values: contentElement.getAvailablePositions()
  });
});

ConfigurationEditorTabView.groups.define('ContentElementCaption', function() {
  this.input('caption', TextInputView, {
    attributeTranslationKeyPrefixes: ['pageflow_scrolled.editor.common_content_element_attributes']
  });
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
