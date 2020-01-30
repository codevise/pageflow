import Marionette from 'backbone.marionette';
import I18n from 'i18n-js';
import {cssModulesUtils, SortableCollectionView} from 'pageflow/ui';

import {ChapterItemView} from './ChapterItemView';

import styles from './EntryOutlineView.module.css';

export const EntryOutlineView = Marionette.Layout.extend({
  tagName: 'nav',
  className: styles.root,

  template: () => `
    <h2>${I18n.t('pageflow_scrolled.editor.entry_outline.header')}</h2>
    <ul class="${styles.chapters}"></ul>

    <a class="${styles.addChapter}" href="">
      ${I18n.t('pageflow_scrolled.editor.entry_outline.add_chapter')}
    </a>
  `,

  ui: cssModulesUtils.ui(styles, 'chapters'),

  events: cssModulesUtils.events(styles, {
    'click addChapter': function() {
      this.options.entry.addChapter();
    }
  }),

  onRender() {
    this.subview(new SortableCollectionView({
      el: this.ui.chapters,
      collection: this.options.entry.chapters,
      itemViewConstructor: ChapterItemView,
      itemViewOptions: {
        entry: this.options.entry
      }
    }));
  }
});
