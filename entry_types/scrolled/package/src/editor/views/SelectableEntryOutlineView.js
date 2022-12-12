import Marionette from 'backbone.marionette';
import {cssModulesUtils, CollectionView} from 'pageflow/ui';

import {SelectableChapterItemView} from './SelectableChapterItemView';

import styles from './SelectableEntryOutlineView.module.css';

export const SelectableEntryOutlineView = Marionette.ItemView.extend({
  template: () => `
    <ul class="${styles.chapters}"></ul>
  `,

  ui: cssModulesUtils.ui(styles, 'chapters'),

  onRender() {
    this.subview(new CollectionView({
      el: this.ui.chapters,
      collection: this.options.entry.chapters,
      itemViewConstructor: SelectableChapterItemView,
      itemViewOptions: {
        entry: this.options.entry,
        onSelectChapter: this.options.onSelectChapter,
        onSelectSection: this.options.onSelectSection
      }
    }));
  }
});
