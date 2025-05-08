import Marionette from 'backbone.marionette';
import I18n from 'i18n-js';
import {cssModulesUtils, SortableCollectionView} from 'pageflow/ui';

import {ChapterItemView} from './ChapterItemView';

import styles from './StorylineItemView.module.css';
import outlineStyles from './outline.module.css';

export const StorylineItemView = Marionette.Layout.extend({
  className: styles.root,

  template: () => `
    <div class="${styles.expandChapters} info_box info">
      <p>
        ${I18n.t('pageflow_scrolled.editor.storyline_item.reorder_chapters')}
      </p>

      <button class="${styles.expandChaptersButton}">
        ${I18n.t('pageflow_scrolled.editor.storyline_item.done')}
      </button>
    </div>
    <ul class="${styles.chapters}"></ul>

    <a class="${styles.addChapter}" href="">
      ${I18n.t('pageflow_scrolled.editor.storyline_item.add_chapter')}
    </a>
  `,

  ui: cssModulesUtils.ui(styles, 'chapters'),

  events: {
    ...cssModulesUtils.events(styles, {
      'click addChapter': function() {
        this.model.addChapter();
      },

      'click expandChaptersButton': function() {
        this.options.viewModel.set('collapsed', false);
      }
    }),
    ...cssModulesUtils.events(outlineStyles, {
      'dragstart chapterLink': function(event) {
        if (!this.options.viewModel.get('collapsed')) {
          event.preventDefault();
          this.options.viewModel.set('collapsed', true);
        }
      }
    })
  },

  onRender() {
    this.sortableCollectionView = new SortableCollectionView({
      el: this.ui.chapters,
      collection: this.model.chapters,
      itemViewConstructor: ChapterItemView,
      itemViewOptions: {
        entry: this.options.entry
      }
    });

    this.subview(this.sortableCollectionView);
    this.sortableCollectionView.disableSorting();

    this.listenTo(this.options.viewModel, 'change:collapsed', (model, collapsed) => {
      this.$el.toggleClass(styles.collapsed, collapsed);

      if (collapsed) {
        this.sortableCollectionView.enableSorting();
      }
      else {
        this.sortableCollectionView.disableSorting();
      }
    });
  }
});
