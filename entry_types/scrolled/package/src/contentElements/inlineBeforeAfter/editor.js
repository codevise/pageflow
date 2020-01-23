import {editor} from 'pageflow-scrolled/editor';

editor.contentElementTypes.register('inlineBeforeAfter', {
  configurationEditor() {
    this.tab('general', function() {
    });
  }
});
