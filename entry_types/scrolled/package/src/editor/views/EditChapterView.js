import {EditConfigurationView} from 'pageflow/editor';
import {TextInputView, TextAreaInputView} from 'pageflow/ui';

export const EditChapterView = EditConfigurationView.extend({
  translationKeyPrefix: 'pageflow_scrolled.editor.edit_chapter',

  configure: function(configurationEditor) {
    configurationEditor.tab('chapter', function() {
      this.input('title', TextInputView);
      this.input('summary', TextAreaInputView, {
        disableLinks: true
      });
    });
  }
});
