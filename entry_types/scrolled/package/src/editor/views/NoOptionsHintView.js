import Marionette from 'backbone.marionette';
import I18n from 'i18n-js';

import styles from './NoOptionsHintView.module.css'

export const NoOptionsHintView = Marionette.ItemView.extend({
  className: styles.hint,
  template: () => I18n.t('pageflow_scrolled.editor.no_options')
});
