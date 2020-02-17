import {editor} from 'pageflow-scrolled/editor';

editor.contentElementTypes.register('inlineVideo', {
  configurationEditor() {
    this.tab('general', function() {
    });
  }
});
