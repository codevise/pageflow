import I18n from 'i18n-js';

import {ConfigurationEditorView} from 'pageflow/ui';

import {editor} from '../../base';

import {InfoBoxView} from '../InfoBoxView';

editor.widgetTypes.register('consent_bar', {
  configurationEditorView: ConfigurationEditorView.extend({
    configure: function() {
      this.tab('consent_bar', function() {
        this.view(InfoBoxView, {
          text: I18n.t('pageflow.editor.consent_bar.widget_type_info_box_text')
        });
      });
    }
  })
});
