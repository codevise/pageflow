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
