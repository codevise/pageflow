import I18n from 'i18n-js';
import Marionette from 'backbone.marionette';

import {app} from 'pageflow/editor';
import {cssModulesUtils} from 'pageflow/ui';

import {dialogView} from './mixins/dialogView';
import dialogViewStyles from './mixins/dialogView.module.css';
import styles from './InsertContentElementDialogView.module.css';

export const SelectLinkDestinationDialogView = Marionette.ItemView.extend({
  template: () => `
    <div class="${dialogViewStyles.backdrop}">
      <div class="editor ${dialogViewStyles.box} ${styles.box}">
        <h1 class="${dialogViewStyles.header}">${I18n.t('pageflow_scrolled.editor.select_link_destination.header')}</h1>

        <div class="${dialogViewStyles.footer}">
          <button class="${dialogViewStyles.close} ${styles.close}">
            ${I18n.t('pageflow_scrolled.editor.select_link_destination.cancel')}
          </button>
        </div>
      </div>
    </div>
  `,

  ui: cssModulesUtils.ui(styles, 'categories'),

  mixins: [dialogView],

  events: {
    'click li button': function() {
      this.close();
    }
  }
});

SelectLinkDestinationDialogView.show = function(options) {
  const view = new SelectLinkDestinationDialogView(options);
  app.dialogRegion.show(view.render());
};
