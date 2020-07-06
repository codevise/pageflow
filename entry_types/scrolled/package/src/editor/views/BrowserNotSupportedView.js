import $ from 'jquery';
import I18n from 'i18n-js';
import Marionette from 'backbone.marionette';
import {cssModulesUtils} from 'pageflow/ui';

import styles from './BrowserNotSupportedView.module.css'

export const BrowserNotSupportedView = Marionette.ItemView.extend({
  template: () => `
     <div class="${styles.main}" />
  `,

  className: styles.main,

  ui: cssModulesUtils.ui(styles, 'main'),
  
  onShow() {
    this.appendOptions();
  },

  appendOptions() {
    
    var container = `<div class='${styles.container}'>
                        <div class='${styles.texts}'>
                          <h2>${I18n.t('pageflow_scrolled.editor.browser_not_supported.heading')}</h2>
                          <p>${I18n.t('pageflow_scrolled.editor.browser_not_supported.text')}</p>
                        </div>
                        <div class='${styles.icons}'>
                          <span class='${styles.chrome} ${styles.child}'></span>
                          <div class='${styles.firefox} ${styles.child}'></div>
                          <div class='${styles.safari} ${styles.child}'></div>
                          <div class='${styles.edge} ${styles.child}'></div>
                        </div>
                    </div>`;
          
    this.ui.main.append($(container));
  }
});

