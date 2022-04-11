import {editor, NoOptionsHintView} from 'pageflow-scrolled/editor';

editor.contentElementTypes.register('soundDisclaimer', {
  category: 'media',
  supportedPositions: ['inline'],

  configurationEditor() {
    this.tab('general', function() {
      this.view(NoOptionsHintView);
    });
  }
});
