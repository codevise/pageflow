import Marionette from 'backbone.marionette';
import Backbone from 'backbone';
import I18n from 'i18n-js';
import {cssModulesUtils} from 'pageflow/ui';
import {DropDownButtonView, ListSelection} from 'pageflow/editor';
import {features} from 'pageflow/frontend';

import {StorylinesTabsView} from './StorylinesTabsView';
import {StorylineItemView} from './StorylineItemView';
import {TrashButtonView} from './TrashButtonView';

import styles from './EntryOutlineView.module.css';

export const EntryOutlineView = Marionette.Layout.extend({
  tagName: 'nav',
  className: styles.root,

  template: () => `
    <div class="${styles.tabs}"></div>
    <div class="${styles.toolbar}">
      <div class="${styles.dropDownButton}"></div>
    </div>
  `,

  ui: cssModulesUtils.ui(styles, 'tabs', 'toolbar', 'dropDownButton'),

  initialize() {
    if (features.isEnabled('fragments')) {
      this.sectionSelection = new ListSelection();
    }
  },

  onRender() {
    this.ui.toolbar.prepend(this.subview(new TrashButtonView({
      entry: this.options.entry,
      nudgeContainer: this.el
    })).render().el);

    const viewModel = new Backbone.Model({collapsed: false});
    const dropDownMenuItems = new Backbone.Collection();

    this.reorderChaptersMenutItem = new MenuItem({}, {
      viewModel,
      selected: () => viewModel.set('collapsed', !viewModel.get('collapsed'))
    });

    dropDownMenuItems.add(this.reorderChaptersMenutItem);

    this.appendSubview(new DropDownButtonView({
      items: dropDownMenuItems,
      alignMenu: 'right',
      ellipsisIcon: true,
      borderless: true,
      openOnClick: true
    }), {to: this.ui.dropDownButton});

    const storylinesTabsView = new StorylinesTabsView({
      entry: this.options.entry,
      itemViewContstuctor: StorylineItemView,
      itemViewOptions: {
        entry: this.options.entry,
        viewModel,
        sectionSelection: this.sectionSelection
      }
    });

    this.listenTo(storylinesTabsView, 'change', () => viewModel.set('collapsed', false));
    this.appendSubview(storylinesTabsView, {to: this.ui.tabs});

    this.ui.tabs.find('.tabs_view-scroller').first().append(this.ui.toolbar);
  }
});

const MenuItem = Backbone.Model.extend({
  initialize(attributes, options) {
    this.options = options;

    this.listenTo(this.options.viewModel, 'change:collapsed', this.updateLabel);
    this.updateLabel();
  },

  selected() {
    this.options.selected();
  },

  updateLabel() {
    this.set(
      'label',
      this.options.viewModel.get('collapsed') ?
      I18n.t('pageflow_scrolled.editor.entry_outline.finish_reorder_chapters') :
      I18n.t('pageflow_scrolled.editor.entry_outline.reorder_chapters'),
    );
  }
});
