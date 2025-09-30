import Marionette from 'backbone.marionette';
import {TabsView} from 'pageflow/editor';

export const StorylinesTabsView = Marionette.View.extend({
  initialize() {
    this.listenTo(this.options.entry, 'change:currentExcursionId', this.updateTab);
  },

  render() {
    this.tabsView = new TabsView({
      i18n: 'pageflow_scrolled.editor.storylines_tabs',
      defaultTab: this.options.entry.isCurrentSectionInExcursion() ? 'excursions' : 'main'
    });

    ['main', 'excursions'].forEach(name => {
      const storyline = this.options.entry.storylines[name]();

      if (storyline) {
        this.tabsView.tab(name, () =>
          new this.options.itemViewContstuctor({
            model: storyline,
            ...this.options.itemViewOptions
          })
        );
      }
    })

    this.appendSubview(this.tabsView);
    return this;
  },

  updateTab() {
    if (this.tabsView) {
      const tabName = this.options.entry.isCurrentSectionInExcursion() ? 'excursions' : 'main';
      this.tabsView.changeTab(tabName);
    }
  }
});
