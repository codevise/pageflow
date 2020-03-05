import {editor} from 'pageflow-scrolled/editor';
import {TextInputView, SelectInputView} from 'pageflow/ui';
import {FileInputView} from 'pageflow/editor';

editor.contentElementTypes.register('inlineImage', {
  configurationEditor() {
    this.tab('general', function() {
      this.input('id', FileInputView, {
        collection: 'image_files',
        fileSelectionHandler: 'contentElementConfiguration'
      });
      this.input('caption', TextInputView);
      this.input('position', SelectInputView, {
        attributeTranslationKeyPrefixes: ['pageflow_scrolled.editor.inputs'],
        values: ['inline', 'sticky', 'full']
      });
    });
  }
});
