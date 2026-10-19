import Marionette from 'backbone.marionette';
import {cssModulesUtils} from 'pageflow/ui';

import {StorylinesTabsView} from './StorylinesTabsView';
import {SelectableStorylineItemView} from './SelectableStorylineItemView';

import styles from './SelectableEntryOutlineView.module.css';

export const SelectableEntryOutlineView = Marionette.Layout.extend({
  template: () => `
    <div class="${styles.tabs}"></div>
  `,

  ui: cssModulesUtils.ui(styles, 'tabs'),

  onRender() {
    this.appendSubview(
      new StorylinesTabsView({
        entry: this.options.entry,
        defaultTab: this.isSelectionInExcursion() ? 'excursions' : undefined,
        itemViewContstuctor: SelectableStorylineItemView,
        itemViewOptions: {
          entry: this.options.entry,
          mode: this.options.mode,
          selection: this.options.selection,
          onSelectChapter: this.options.onSelectChapter,
          onSelectSection: this.options.onSelectSection,
          onSelectInsertPosition: this.options.onSelectInsertPosition,
          onSelectSectionPart: this.options.onSelectSectionPart
        }
      }),
      {to: this.ui.tabs}
    );
  },

  isSelectionInExcursion() {
    const chapter = this.selectedChapter();
    return !!chapter && chapter.isExcursion();
  },

  selectedChapter() {
    const {entry, selection} = this.options;

    if (!selection) {
      return null;
    }

    if (selection.get('section')) {
      const section = entry.sections.findWhere({permaId: selection.get('section')});
      return section && section.chapter;
    }

    return entry.chapters.findWhere({permaId: selection.get('chapter')});
  }
});
