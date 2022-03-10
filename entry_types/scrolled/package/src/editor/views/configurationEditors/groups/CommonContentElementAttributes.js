import {ConfigurationEditorTabView, SelectInputView, TextInputView} from 'pageflow/ui';

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
  function({entry, model, prefix, fallback}) {
    const contentElement = this.model.parent;

    if (entry.getTypographyVariants({contentElement})[0].length) {
      const [variants, translationKeys] = entry.getTypographyVariants({
        contentElement,
        prefix
      });

      this.input('typographyVariant', SelectInputView, {
        model: model || this.model,
        blankTranslationKey: 'pageflow_scrolled.editor.' +
                             'common_content_element_attributes.' +
                             'typographyVariant.blank',
        attributeTranslationKeyPrefixes: [
          'pageflow_scrolled.editor.common_content_element_attributes'
        ],
        disabled: !variants.length,
        includeBlank: true,
        values: variants,
        translationKeys
      });
    }
    else if (fallback) {
      fallback.call(this);
    }
  }
);
