import classNames from 'classnames';
import I18n from 'i18n-js';
import Marionette from 'backbone.marionette';
import {cssModulesUtils} from 'pageflow/ui';

import {SectionThumbnailView} from './SectionThumbnailView';

import hiddenIcon from './images/hidden.svg';

import baseStyles from './SectionItemView.module.css';
import styles from './SelectableSectionItemView.module.css';

export const SelectableSectionItemView = Marionette.ItemView.extend({
  tagName: 'li',

  className() {
    return classNames(baseStyles.root, {
      [styles.selectable]: !this.options.mode,
      [baseStyles.hidden]: this.model.configuration.get('hidden')
    });
  },

  template: (data) => `
    <div class="${styles.outline} ${baseStyles.outline}">
      <div class="${baseStyles.thumbnailContainer}">
        <div class="${baseStyles.thumbnail}"></div>
        ${data.hidden ? `
          <img class="${baseStyles.hiddenIndicator}"
               title="${I18n.t('pageflow_scrolled.editor.section_item.hidden')}"
               src="${hiddenIcon}"
               width="30"
               height="30">
        ` : ''}
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
      mode: this.options.mode,
      hidden: this.model.configuration.get('hidden')
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

  initialize() {
    if (this.options.selection) {
      this.listenTo(this.options.selection, 'change', this.updateSelected);
    }
  },

  onRender() {
    this.subview(new SectionThumbnailView({
      el: this.ui.thumbnail,
      model: this.model,
      entry: this.options.entry
    }));

    if (this.updateSelected()) {
      setTimeout(() => this.el.scrollIntoView({block: 'center'}), 10);
    }
  },

  updateSelected() {
    const selected = !!this.options.selection &&
                     this.options.selection.get('section') === this.model.get('permaId');

    this.$el.toggleClass(baseStyles.active, selected);
    this.$el.attr('aria-current', selected ? 'true' : null);

    return selected;
  }
});
