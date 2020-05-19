import {EditConfigurationView} from 'pageflow/editor';
import {SelectInputView} from 'pageflow/ui';

export const EditSectionTransitionView = EditConfigurationView.extend({
  translationKeyPrefix: 'pageflow_scrolled.editor.edit_section_transition',

  configure: function(configurationEditor) {
    configurationEditor.tab('transition', function() {
      this.input('transition', SelectInputView, {
        values: ['beforeAfter', 'fade', 'fadeBg', 'reveal', 'scroll', 'scrollOver']
      });
    });
  }
});
