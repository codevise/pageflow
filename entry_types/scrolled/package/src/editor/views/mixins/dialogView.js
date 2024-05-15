import {cssModulesUtils} from 'pageflow/ui';

import styles from './dialogView.module.css';

export const dialogView = {
  events: cssModulesUtils.events(styles, {
    'mousedown backdrop': function(event) {
      if (!event.target.closest(`.${styles.box}`)) {
        this.close();
      }
    },

    'click close': function() {
      this.close()
    }
  })
};
