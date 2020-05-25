import {editor} from 'pageflow-scrolled/editor';

editor.contentElementTypes.register('soundDisclaimer', {
  supportedPositions: ['inline'],

  configurationEditor() {
    this.tab('general', function() {
    });
  }
});
