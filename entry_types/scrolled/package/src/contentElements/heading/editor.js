import {editor} from 'pageflow-scrolled/editor';
import {SelectInputView} from 'pageflow/ui';

editor.contentElementTypes.register('heading', {
  supportedPositions: ['inline', 'wide'],

  defaultConfig: {position: 'wide'},

  configurationEditor() {
    this.tab('general', function() {
      this.input('textSize', SelectInputView, {
        values: ['auto', 'large', 'medium', 'small']
      });
      this.group('ContentElementPosition');
    });
  }
});
