import I18n from 'i18n-js';
import Marionette from 'backbone.marionette';
import {cssModulesUtils} from 'pageflow/ui';

import {SectionThumbnailView} from './SectionThumbnailView';

import styles from './SectionItemView.module.css';

export const SelectableSectionItemView = Marionette.ItemView.extend({
  tagName: 'li',
  className: `${styles.root} ${styles.selectable}`,

  template: (data) => `
    <div class="${styles.outline}">
      <div class="${styles.thumbnailContainer}">
        <div class="${styles.thumbnail}"></div>
        <a class="${styles.clickMask}"
           href=""
           title="${I18n.t(`pageflow_scrolled.editor.selectable_section_item.title`)}">
        </a>
      </div>
    </div>
       `,

  ui: cssModulesUtils.ui(styles, 'thumbnail'),

  events: {
    [`click .${styles.clickMask}`]: function(event) {
      event.preventDefault();
      this.options.onSelect(this.model);
    }
  },

  onRender() {
    this.subview(new SectionThumbnailView({
      el: this.ui.thumbnail,
      model: this.model,
      entry: this.options.entry
    }));
  }
});
