import I18n from 'i18n-js';
import Marionette from 'backbone.marionette';

import {cssModulesUtils, CollectionView} from 'pageflow/ui';

import {SelectableSectionItemView} from './SelectableSectionItemView';

import styles from './ChapterItemView.module.css';

export const SelectableChapterItemView = Marionette.ItemView.extend({
  tagName: 'li',
  className: styles.root,

  template: () => `
     <a class="${styles.link}"
        href=""
        title="${I18n.t(`pageflow_scrolled.editor.selectable_chapter_item.title`)}">
       <span class="${styles.number}"></span>
       <span class="${styles.title}"></span>
     </a>

     <ul class="${styles.sections}"></ul>
     `,

  ui: cssModulesUtils.ui(styles, 'title', 'number', 'sections'),

  events: cssModulesUtils.events(styles, {
    'click link': function(event) {
      event.preventDefault();
      return this.options.onSelectChapter(this.model);
    },

    'mouseenter link': function() {
      this.$el.addClass(styles.selectableHover);
    },

    'mouseleave link': function() {
      this.$el.removeClass(styles.selectableHover);
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
    this.ui.title.text(this.model.configuration.get('title') || I18n.t('pageflow.editor.views.chapter_item_view.unnamed'));
    this.ui.number.text(I18n.t('pageflow.editor.views.chapter_item_view.chapter') + ' ' + (this.model.get('position') + 1));
  }
});
