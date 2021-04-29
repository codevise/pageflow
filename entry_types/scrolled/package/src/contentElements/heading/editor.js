import {editor} from 'pageflow-scrolled/editor';

editor.contentElementTypes.register('heading', {
  supportedPositions: ['inline', 'wide'],

  configurationEditor() {
    this.tab('general', function() {
      this.group('ContentElementPosition');
    });
  }
});
