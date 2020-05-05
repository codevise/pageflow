import {cssModulesUtils} from 'pageflow/ui';

import styles from './dialogView.module.css';

export const dialogView = {
  events: cssModulesUtils.events(styles, {
    'mousedown backdrop': function() {
      this.close()
    },

    'mousedown box': function(event) {
      event.stopPropagation();
    },

    'click close': function() {
      this.close()
    }
  })
};
