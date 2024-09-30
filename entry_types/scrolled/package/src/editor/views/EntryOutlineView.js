import Marionette from 'backbone.marionette';
import Backbone from 'backbone';
import I18n from 'i18n-js';
import {cssModulesUtils, SortableCollectionView} from 'pageflow/ui';
import {DropDownButtonView} from 'pageflow/editor';

import {ChapterItemView} from './ChapterItemView';

import styles from './EntryOutlineView.module.css';

export const EntryOutlineView = Marionette.Layout.extend({
  tagName: 'nav',
  className: styles.root,

  template: () => `
    <h2 class="sidebar-header ${styles.header}">
      ${I18n.t('pageflow_scrolled.editor.entry_outline.header')}
    </h2>
    <div class="${styles.toolbar}">
      <div class="${styles.dropDownButton}"></div>
      <button class="${styles.expandChapters}">
        ${I18n.t('pageflow_scrolled.editor.entry_outline.done')}
      </button>
    </div>
    <ul class="${styles.chapters}"></ul>

    <a class="${styles.addChapter}" href="">
      ${I18n.t('pageflow_scrolled.editor.entry_outline.add_chapter')}
    </a>
  `,

  ui: cssModulesUtils.ui(styles, 'header', 'dropDownButton', 'chapters'),

  events: cssModulesUtils.events(styles, {
    'click addChapter': function() {
      this.options.entry.addChapter();
    },

    'click expandChapters': function() {
      this.toggleCollapsed();
    }
  }),

  initialize() {
    this.collapsed = false;
  },

  onRender() {
    const dropDownMenuItems = new Backbone.Collection();

    this.reorderChaptersMenutItem = new MenuItem({
      label: I18n.t('pageflow_scrolled.editor.entry_outline.reorder_chapters')
    }, {
      selected: () =>
        this.toggleCollapsed()
    })

    dropDownMenuItems.add(this.reorderChaptersMenutItem);

    this.appendSubview(new DropDownButtonView({
      items: dropDownMenuItems,
      alignMenu: 'right',
      ellipsisIcon: true,
      borderless: true,
      openOnClick: true
    }), {to: this.ui.dropDownButton});

    this.sortableCollectionView = new SortableCollectionView({
      el: this.ui.chapters,
      collection: this.options.entry.chapters,
      itemViewConstructor: ChapterItemView,
      itemViewOptions: {
        entry: this.options.entry
      }
    });

    this.subview(this.sortableCollectionView);
    this.sortableCollectionView.disableSorting();
  },

  toggleCollapsed() {
    this.collapsed = !this.collapsed;

    this.$el.toggleClass(styles.collapsed, this.collapsed);

    if (this.collapsed) {
      this.ui.header.text(
        I18n.t('pageflow_scrolled.editor.entry_outline.reorder_chapters_header')
      );

      this.sortableCollectionView.enableSorting();
    }
    else {
      this.ui.header.text(
        I18n.t('pageflow_scrolled.editor.entry_outline.header')
      );

      this.sortableCollectionView.disableSorting();

    }
  }
});

const MenuItem = Backbone.Model.extend({
  initialize: function(attributes, options) {
    this.options = options;
  },

  selected: function() {
    this.options.selected();
  }
});
