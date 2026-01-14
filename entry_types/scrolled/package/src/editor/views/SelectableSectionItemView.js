import classNames from 'classnames';
import I18n from 'i18n-js';
import Marionette from 'backbone.marionette';
import {cssModulesUtils} from 'pageflow/ui';

import {SectionThumbnailView} from './SectionThumbnailView';

import baseStyles from './SectionItemView.module.css';
import styles from './SelectableSectionItemView.module.css';

export const SelectableSectionItemView = Marionette.ItemView.extend({
  tagName: 'li',

  className() {
    return classNames(baseStyles.root, {
      [styles.selectable]: !this.options.mode
    });
  },

  template: (data) => `
    <div class="${styles.outline} ${baseStyles.outline}">
      <div class="${baseStyles.thumbnailContainer}">
        <div class="${baseStyles.thumbnail}"></div>
        ${data.mode === 'insertPosition' ? `
          <a class="${styles.insertBeforeMask}" href="">
            <span class="${styles.indicatorTooltipTop}">
              ${I18n.t('pageflow_scrolled.editor.selectable_section_item.insert_here')}
            </span>
          </a>
          <a class="${styles.insertAfterMask}" href="">
            <span class="${styles.indicatorTooltipBottom}">
              ${I18n.t('pageflow_scrolled.editor.selectable_section_item.insert_here')}
            </span>
          </a>
        ` : data.mode === 'sectionPart' ? `
          <a class="${styles.insertAtBeginningMask}" href="">
            <span class="${styles.indicatorTooltipInsideTop}">
              ${I18n.t('pageflow_scrolled.editor.selectable_section_item.insert_at_beginning')}
            </span>
          </a>
          <a class="${styles.insertAtEndMask}" href="">
            <span class="${styles.indicatorTooltipInsideBottom}">
              ${I18n.t('pageflow_scrolled.editor.selectable_section_item.insert_at_end')}
            </span>
          </a>
        ` : `
          <a class="${styles.clickMask}"
             href=""
             title="${I18n.t('pageflow_scrolled.editor.selectable_section_item.title')}">
          </a>
        `}
      </div>
    </div>
  `,

  ui: cssModulesUtils.ui(baseStyles, 'thumbnail'),

  serializeData() {
    return {
      mode: this.options.mode
    };
  },

  events: cssModulesUtils.events(styles, {
    [`click clickMask`]: function(event) {
      event.preventDefault();
      this.options.onSelect(this.model);
    },
    [`click insertBeforeMask`]: function(event) {
      event.preventDefault();
      this.options.onSelectInsertPosition({
        section: this.model,
        position: 'before'
      });
    },
    [`click insertAfterMask`]: function(event) {
      event.preventDefault();
      this.options.onSelectInsertPosition({
        section: this.model,
        position: 'after'
      });
    },
    [`click insertAtBeginningMask`]: function(event) {
      event.preventDefault();
      this.options.onSelectSectionPart({
        section: this.model,
        part: 'beginning'
      });
    },
    [`click insertAtEndMask`]: function(event) {
      event.preventDefault();
      this.options.onSelectSectionPart({
        section: this.model,
        part: 'end'
      });
    }
  }),

  onRender() {
    this.subview(new SectionThumbnailView({
      el: this.ui.thumbnail,
      model: this.model,
      entry: this.options.entry
    }));
  }
});
