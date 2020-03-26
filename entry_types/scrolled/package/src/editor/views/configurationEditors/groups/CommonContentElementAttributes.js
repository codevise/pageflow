import {ConfigurationEditorTabView, SelectInputView, TextInputView} from 'pageflow/ui';

ConfigurationEditorTabView.groups.define('ContentElementPosition', function() {
  this.input('position', SelectInputView, {
    attributeTranslationKeyPrefixes: ['pageflow_scrolled.editor.common_content_element_attributes'],
    values: ['inline', 'sticky', 'full']
  });
});

ConfigurationEditorTabView.groups.define('ContentElementCaption', function() {
  this.input('caption', TextInputView, {
    attributeTranslationKeyPrefixes: ['pageflow_scrolled.editor.common_content_element_attributes']
  });
});
