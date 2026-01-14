import I18n from 'i18n-js';
import Marionette from 'backbone.marionette';
import {cssModulesUtils, CollectionView} from 'pageflow/ui';

import {SelectableChapterItemView} from './SelectableChapterItemView';

import styles from './StorylineItemView.module.css';
import selectableStyles from './SelectableStorylineItemView.module.css';

function blankSlateView(isMain) {
  return Marionette.ItemView.extend({
    className: selectableStyles.blankSlate,

    template: (data) => I18n.t(data.translationKey),

    serializeData() {
      return {
        translationKey: isMain ?
          'pageflow_scrolled.editor.selectable_storyline_item.blank_slate' :
          'pageflow_scrolled.editor.selectable_storyline_item.blank_slate_excursions'
      };
    }
  });
}

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
        entry: this.options.entry,
        mode: this.options.mode,
        onSelectChapter: this.options.onSelectChapter,
        onSelectSection: this.options.onSelectSection,
        onSelectInsertPosition: this.options.onSelectInsertPosition,
        onSelectSectionPart: this.options.onSelectSectionPart
      },
      blankSlateViewConstructor: blankSlateView(this.model.isMain())
    }));
  }
});
