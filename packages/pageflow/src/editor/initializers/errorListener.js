import I18n from 'i18n-js';

import {app} from '../app';

app.addInitializer(function() {
  app.on('error', function(e) {
    if (e.message) {
      alert(e.message);
    }
    else {
      alert(I18n.t(e.name, {
        scope: 'pageflow.editor.errors',
        defaultValue: I18n.t('pageflow.editor.errors.unknown')
      }));
    }
  });
});
