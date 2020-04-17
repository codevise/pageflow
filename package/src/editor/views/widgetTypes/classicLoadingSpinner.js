import I18n from 'i18n-js';

import {ConfigurationEditorView} from 'pageflow/ui';

import {editor} from '../../base';

import {InfoBoxView} from '../InfoBoxView';

editor.widgetTypes.register('classic_loading_spinner', {
  configurationEditorView: ConfigurationEditorView.extend({
    configure: function() {
      this.tab('loading_spinner', function() {
        this.view(InfoBoxView, {
          text: I18n.t('pageflow.editor.classic_loading_spinner.widget_type_info_box_text')
        });
      });
    }
  })
});
