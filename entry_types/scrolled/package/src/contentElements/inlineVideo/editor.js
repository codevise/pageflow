import {editor} from 'pageflow-scrolled/editor';
import {SelectInputView} from 'pageflow/ui';
import {FileInputView} from 'pageflow/editor';

editor.contentElementTypes.register('inlineVideo', {
  configurationEditor() {
    this.tab('general', function() {
      this.input('id', FileInputView, {
        collection: 'video_files',
        fileSelectionHandler: 'contentElementConfiguration',
        positioning: false
      });
      this.group('ContentElementCaption');
      this.group('ContentElementPosition');
    });
  }
});
