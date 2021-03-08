import {editor, NoOptionsHintView} from 'pageflow-scrolled/editor';

editor.contentElementTypes.register('heading', {
  supportedPositions: ['inline', 'full'],

  configurationEditor() {
    this.tab('general', function() {
      this.group('ContentElementPosition');
    });
  }
});
