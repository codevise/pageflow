import I18n from 'i18n-js';
import Marionette from 'backbone.marionette';

import {cssModulesUtils} from 'pageflow/ui';

import styles from './LinkToFileView.module.css';

export const LinkToFileView = Marionette.ItemView.extend({
  template: () => `
    <button type="button" class="${styles.selectFileButton}">
      ${I18n.t('pageflow_scrolled.editor.select_link_destination.select_in_sidebar')}
    </button>
  `,

  events: cssModulesUtils.events(styles, {
    'click selectFileButton': function() {
      this.options.onSelectFile();
    }
  })
});
