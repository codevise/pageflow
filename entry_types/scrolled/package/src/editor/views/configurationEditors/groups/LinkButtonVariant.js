import {
  ConfigurationEditorTabView,
  SelectInputView,
} from 'pageflow/ui';

ConfigurationEditorTabView.groups.define(
  'LinkButtonVariant',
  function({entry, visibleBinding, visible}) {
    const [variants, texts] = entry.getComponentVariants({
      name: 'linkButton'
    });

    if (variants.length) {
      this.input('linkButtonVariant', SelectInputView, {
        attributeTranslationKeyPrefixes: [
          'pageflow_scrolled.editor.link_button_variant_attributes'
        ],
        includeBlank: true,
        values: variants,
        texts,
        visibleBinding,
        visible: visible || true
      });
    }
  }
);
