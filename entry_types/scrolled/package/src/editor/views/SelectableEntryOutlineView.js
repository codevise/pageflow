import Marionette from 'backbone.marionette';
import {cssModulesUtils} from 'pageflow/ui';
import {TabsView} from 'pageflow/editor';

import {SelectableStorylineItemView} from './SelectableStorylineItemView';

import styles from './SelectableEntryOutlineView.module.css';

export const SelectableEntryOutlineView = Marionette.Layout.extend({
  template: () => `
    <div class="${styles.tabs}"></div>
  `,

  ui: cssModulesUtils.ui(styles, 'tabs'),

  onRender() {
    const tabsView = new TabsView({
      i18n: 'pageflow_scrolled.editor.entry_outline.tabs',
    });

    tabsView.tab('main', () => new SelectableStorylineItemView({
      model: this.options.entry.storylines.main(),
      entry: this.options.entry,
      onSelectChapter: this.options.onSelectChapter,
      onSelectSection: this.options.onSelectSection
    }));

    this.appendSubview(
      tabsView,
      {to: this.ui.tabs}
    );
  },
});
