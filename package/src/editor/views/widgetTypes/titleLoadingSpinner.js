import I18n from 'i18n-js';

import {CheckBoxInputView, ConfigurationEditorView, SliderInputView, TextInputView} from 'pageflow/ui';

import {editor} from '../../base';

import {FileInputView} from '../inputs/FileInputView';
import {InfoBoxView} from '../InfoBoxView';

import {state} from '$state';

editor.widgetTypes.register('title_loading_spinner', {
  configurationEditorView: ConfigurationEditorView.extend({
    configure: function() {
      this.tab('loading_spinner', function() {
        this.view(InfoBoxView, {
          text: I18n.t('pageflow.editor.title_loading_spinner.widget_type_info_box_text')
        });
        this.input('title', TextInputView, {
          placeholder: state.entry.metadata.get('title') ||
                       state.entry.get('entry_title'),
        });
        this.input('subtitle', TextInputView);
        this.input('custom_background_image_id', FileInputView, {
          collection: 'image_files',
          fileSelectionHandler: 'widgetConfiguration'
        });
        this.input('invert', CheckBoxInputView);
        this.input('remove_logo', CheckBoxInputView);
        this.input('blur_strength', SliderInputView);
        this.input('animation_duration', SliderInputView, {minValue: 1, maxValue: 7, defaultValue: 7, unit: 's'})
      });
    }
  })
});
