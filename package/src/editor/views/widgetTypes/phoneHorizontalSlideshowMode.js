import I18n from 'i18n-js';

import {ConfigurationEditorView} from 'pageflow/ui';

import {editor} from '../../base';

import {HelpImageView} from '../HelpImageView';
import {InfoBoxView} from '../InfoBoxView';

editor.widgetTypes.register('phone_horizontal_slideshow_mode', {
  configurationEditorView: ConfigurationEditorView.extend({
    configure: function() {
      this.tab('phone_horizontal_slideshow_mode', function() {
        this.view(InfoBoxView, {
          text: I18n.t('pageflow.editor.phone_horizontal_slideshow_mode.widget_type_info_box_text')
        });
        this.view(HelpImageView, {
          imageName: 'phone_horizontal_slideshow_mode'
        });
      });
    }
  })
});
