import Marionette from 'backbone.marionette';
import Backbone from 'backbone';
import I18n from 'i18n-js';
import {cssModulesUtils} from 'pageflow/ui';
import {DropDownButtonView} from 'pageflow/editor';

import {StorylinesTabsView} from './StorylinesTabsView';
import {StorylineItemView} from './StorylineItemView';

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

  ui: cssModulesUtils.ui(styles, 'tabs', 'dropDownButton'),

  onRender() {
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

    this.appendSubview(
      new StorylinesTabsView({
        entry: this.options.entry,
        itemViewContstuctor: StorylineItemView,
        itemViewOptions: {
          entry: this.options.entry,
          viewModel
        }
      }),
      {to: this.ui.tabs}
    );
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
