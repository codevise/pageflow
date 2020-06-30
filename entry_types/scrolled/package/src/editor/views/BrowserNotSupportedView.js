import $ from 'jquery';
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
                        <h1>Your Browser is not Supported</h1>
                        <p>To use the editor please use one of the latest browsers</p>
                    </div>`;
          
    this.ui.main.append($(container));
  }
});

