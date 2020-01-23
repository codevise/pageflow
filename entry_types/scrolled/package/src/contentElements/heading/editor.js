import {editor} from 'pageflow-scrolled/editor';
import {TextInputView} from 'pageflow/ui';

editor.contentElementTypes.register('heading', {
  configurationEditor() {
    this.tab('general', function() {
      this.input('children', TextInputView);
    });
  }
});
