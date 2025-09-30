import Marionette from 'backbone.marionette';
import {TabsView} from 'pageflow/editor';

export const StorylinesTabsView = Marionette.View.extend({
  render() {
    const tabsView = new TabsView({
      i18n: 'pageflow_scrolled.editor.storylines_tabs',
      defaultTab: this.options.entry.isCurrentSectionInExcursion() ? 'excursions' : 'main'
    });

    ['main', 'excursions'].forEach(name => {
      const storyline = this.options.entry.storylines[name]();

      if (storyline) {
        tabsView.tab(name, () =>
          new this.options.itemViewContstuctor({
            model: storyline,
            ...this.options.itemViewOptions
          })
        );
      }
    })

    this.appendSubview(tabsView);
    return this;
  }
});
