import {editor, NoOptionsHintView} from 'pageflow-scrolled/editor';

editor.contentElementTypes.register('heading', {
  supportedPositions: ['inline'],

  configurationEditor() {
    this.tab('general', function() {
      this.view(NoOptionsHintView);
    });
  }
});
