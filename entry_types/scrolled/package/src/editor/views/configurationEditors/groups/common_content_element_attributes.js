import {ConfigurationEditorTabView, SelectInputView} from 'pageflow/ui';

ConfigurationEditorTabView.groups.define('content_element_position', function() {
  this.input('position', SelectInputView, {
    attributeTranslationKeyPrefixes: ['pageflow_scrolled.editor.common_content_element_attributes'],
    values: ['inline', 'sticky', 'full']
  });
});