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
        itemViewContstuctor: SelectableStorylineItemView,
        itemViewOptions: {
          entry: this.options.entry,
          onSelectChapter: this.options.onSelectChapter,
          onSelectSection: this.options.onSelectSection
        }
      }),
      {to: this.ui.tabs}
    );
  }
});
