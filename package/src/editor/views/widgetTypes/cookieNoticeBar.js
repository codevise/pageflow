import I18n from 'i18n-js';

import {ConfigurationEditorView} from 'pageflow/ui';

import {editor} from '../../base';

import {InfoBoxView} from '../InfoBoxView';

editor.widgetTypes.registerRole('cookie_notice', {
  isOptional: true
});

editor.widgetTypes.register('cookie_notice_bar', {
  configurationEditorView: ConfigurationEditorView.extend({
    configure: function() {
      this.tab('cookie_notice_bar', function() {
        this.view(InfoBoxView, {
          text: I18n.t('pageflow.editor.cookie_notice_bar.widget_type_info_box_text')
        });
      });
    }
  })
});
