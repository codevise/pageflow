import {editor} from 'pageflow-scrolled/editor';
import {FileInputView} from 'pageflow/editor';

editor.contentElementTypes.register('inlineAudio', {
  configurationEditor() {
    this.tab('general', function() {
      this.input('id', FileInputView, {
        collection: 'audio_files',
        fileSelectionHandler: 'contentElementConfiguration',
        positioning: false
      });

      this.input('posterId', FileInputView, {
        collection: 'image_files',
        fileSelectionHandler: 'contentElementConfiguration',
        positioning: false
      });

      this.group('ContentElementPosition');
    });
  }
});
