import Marionette from 'backbone.marionette';
import I18n from 'i18n-js';

import pictogramUrl from './images/excursion-pictogram.svg';
import styles from './ExcursionBlankSlateView.module.css';

export const ExcursionBlankSlateView = Marionette.ItemView.extend({
  className: styles.box,

  template: () => `
    <div class="${styles.pictogram}">
      <img src="${pictogramUrl}" alt="" />
    </div>
    <div>
      ${I18n.t('pageflow_scrolled.editor.storyline_item.excursion_blank_slate')}
    </div>
  `
});
