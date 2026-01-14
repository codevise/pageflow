import I18n from 'i18n-js';
import Marionette from 'backbone.marionette';
import classNames from 'classnames';

import {cssModulesUtils, CollectionView} from 'pageflow/ui';

import {SelectableSectionItemView} from './SelectableSectionItemView';

import baseStyles from './ChapterItemView.module.css';
import styles from './SelectableChapterItemView.module.css';

export const SelectableChapterItemView = Marionette.ItemView.extend({
  tagName: 'li',

  className: classNames(baseStyles.root, styles.root),

  template: () => `
     <a class="${baseStyles.link}"
        href=""
        title="${I18n.t(`pageflow_scrolled.editor.selectable_chapter_item.title`)}">
       <span class="${baseStyles.number}"></span>
       <span class="${baseStyles.title}"></span>
     </a>

     <ul class="${baseStyles.sections}"></ul>
     `,

  ui: cssModulesUtils.ui(baseStyles, 'title', 'number', 'sections'),

  events: cssModulesUtils.events(baseStyles, {
    'click link': function(event) {
      event.preventDefault();
      return this.options.onSelectChapter(this.model);
    },

    'mouseenter link': function() {
      this.$el.addClass(baseStyles.selectableHover);
    },

    'mouseleave link': function() {
      this.$el.removeClass(baseStyles.selectableHover);
    }
  }),

  modelEvents: {
    change: 'update'
  },

  onRender() {
    this.subview(new CollectionView({
      el: this.ui.sections,
      collection: this.model.sections,
      itemViewConstructor: SelectableSectionItemView,
      itemViewOptions: {
        entry: this.options.entry,
        onSelect: this.options.onSelectSection
      }
    }));

    this.update();
  },

  update() {
    this.ui.title.text(this.model.getDisplayTitle());
    this.ui.number.text(this.model.getDisplayNumber());
  }
});
