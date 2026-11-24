import {editor, ColorSelectInputView} from 'pageflow-scrolled/editor';
import {CheckBoxInputView, ConfigurationEditorView} from 'pageflow/ui';

editor.widgetTypes.register('defaultNavigation', {
  configurationEditorView: ConfigurationEditorView.extend({
    configure: function() {
      const [values, texts] = this.options.entry.getPaletteColors({name: 'accentColors'});

      this.tab('defaultNavigation', function() {
        if (values.length) {
          this.input('accentColor', ColorSelectInputView, {
            includeBlank: true,
            blankTranslationKey: 'pageflow_scrolled.editor.' +
                                 'common_content_element_attributes.' +
                                 'palette_color.blank',
            values,
            texts,
          });
        }

        this.input('hideToggleMuteButton', CheckBoxInputView);
        this.input('hideSharingButton', CheckBoxInputView);
        this.input('fixedOnDesktop', CheckBoxInputView);
        this.input('firstBackdropBelowNavigation', CheckBoxInputView, {
          disabledBinding: 'fixedOnDesktop',
          disabled: fixedOnDesktop => !fixedOnDesktop,
          displayUncheckedIfDisabled: true
        });
      });
    }
  })
});
