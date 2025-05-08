import Marionette from 'backbone.marionette';
import {cssModulesUtils, CollectionView} from 'pageflow/ui';

import {SelectableChapterItemView} from './SelectableChapterItemView';

import styles from './StorylineItemView.module.css';

export const SelectableStorylineItemView = Marionette.ItemView.extend({
  template: () => `
    <ul class="${styles.chapters}"></ul>
  `,

  ui: cssModulesUtils.ui(styles, 'chapters'),

  onRender() {
    this.subview(new CollectionView({
      el: this.ui.chapters,
      collection: this.model.chapters,
      itemViewConstructor: SelectableChapterItemView,
      itemViewOptions: {
        entry: this.model,
        onSelectChapter: this.options.onSelectChapter,
        onSelectSection: this.options.onSelectSection
      }
    }));
  }
});
