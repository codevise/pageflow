import I18n from 'i18n-js';

import {editor} from 'pageflow-scrolled/editor';
import {
  ConfigurationEditorView,
  SelectInputView,
  SeparatorView,
  TextInputView
} from 'pageflow/ui';

const sheetWidths = ['full', 'inset'];

editor.widgetTypes.register('excursionSheet', {
  configurationEditorView: ConfigurationEditorView.extend({
    configure: function() {
      const entry = this.options.entry;

      this.tab('excursionSheet', function() {
        this.input('sheetWidth', SelectInputView, {
          values: sheetWidths
        });
        this.input('returnButtonLabel', TextInputView, {
          placeholder: defaultReturnButtonLabel(entry)
        });
      });
    }
  }),

  configurationEditorTabViewGroups: {
    ChapterExcursionSettings: function() {
      const entry = this.model.parent.entry;
      const widgetConfiguration = entry.widgets.get('excursion').configuration;

      this.view(SeparatorView);
      this.input('sheetWidth', SelectInputView, {
        values: sheetWidths,
        placeholderValue: widgetConfiguration.get('sheetWidth') || sheetWidths[0]
      });
      this.input('returnButtonLabel', TextInputView, {
        placeholder: widgetConfiguration.get('returnButtonLabel') ||
                     defaultReturnButtonLabel(entry)
      });
    }
  }
});

function defaultReturnButtonLabel(entry) {
  return I18n.t('pageflow_scrolled.public.exit_excursion', {
    locale: entry.metadata.get('locale')
  });
}
