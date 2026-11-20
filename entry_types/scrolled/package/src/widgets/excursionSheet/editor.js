import {editor} from 'pageflow-scrolled/editor';
import {SelectInputView, SeparatorView, TextInputView} from 'pageflow/ui';

editor.widgetTypes.register('excursionSheet', {
  configurationEditorTabViewGroups: {
    ChapterExcursionSettings: function() {
      this.view(SeparatorView);
      this.input('sheetWidth', SelectInputView, {
        values: ['full', 'inset']
      });
      this.input('returnButtonLabel', TextInputView);
    }
  }
});
