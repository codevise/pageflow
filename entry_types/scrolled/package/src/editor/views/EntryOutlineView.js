import Marionette from 'backbone.marionette';
import Backbone from 'backbone';
import I18n from 'i18n-js';
import {cssModulesUtils} from 'pageflow/ui';
import {DropDownButtonView, ListSelection} from 'pageflow/editor';
import {features} from 'pageflow/frontend';

import {StorylinesTabsView} from './StorylinesTabsView';
import {StorylineItemView} from './StorylineItemView';
import {TrashButtonView} from './TrashButtonView';
import {ExtractFragmentDialogView} from './ExtractFragmentDialogView';
import {ExtractSectionsFragmentMenuItem} from '../models/sectionMenuItems';

import styles from './EntryOutlineView.module.css';

export const EntryOutlineView = Marionette.Layout.extend({
  tagName: 'nav',
  className: styles.root,

  template: () => `
    <div class="${styles.tabs}"></div>
    <div class="${styles.toolbar}">
      <div class="${styles.dropDownButton}"></div>
    </div>
    <div class="${styles.selectionBar}" hidden>
      <div class="${styles.selectionBarBox}">
        <div class="${styles.selectionBarStatus}">
          <span class="${styles.selectionBarText}" aria-live="polite"></span>
          <button type="button"
                  class="${styles.selectionBarDismiss}"
                  title="${I18n.t('pageflow_scrolled.editor.entry_outline.end_selection')}"
                  aria-label="${I18n.t('pageflow_scrolled.editor.entry_outline.end_selection')}">
          </button>
        </div>
        <div class="${styles.selectionBarActions}">
          <button type="button" class="${styles.selectionBarAction}">
            ${I18n.t('pageflow_scrolled.editor.extract_sections_fragment_menu_item.label')}
          </button>
        </div>
      </div>
    </div>
  `,

  ui: cssModulesUtils.ui(styles,
                         'tabs', 'toolbar', 'dropDownButton',
                         'selectionBar', 'selectionBarText', 'selectionBarAction'),

  events: cssModulesUtils.events(styles, {
    'click selectionBarDismiss': function() {
      this.sectionSelection.stop();
    },

    'click selectionBarAction': function() {
      const menuItem = new ExtractSectionsFragmentMenuItem({}, {
        entry: this.options.entry,
        sections: this.sectionSelection.models.slice()
      });

      ExtractFragmentDialogView.show({
        onSubmit: title => {
          this.sectionSelection.stop();
          menuItem.extract(title);
        }
      });
    }
  }),

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

    if (this.sectionSelection) {
      dropDownMenuItems.add(new SelectSectionsMenuItem({}, {
        sectionSelection: this.sectionSelection
      }));

      this.setupSelectionBar();
      this.makeSelectionAndReorderingExclusive(viewModel);
    }
    else {
      this.ui.selectionBar.remove();
    }

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

    this.listenTo(storylinesTabsView, 'change', () => {
      viewModel.set('collapsed', false);
      this.sectionSelection?.stop();
    });

    this.appendSubview(storylinesTabsView, {to: this.ui.tabs});

    this.ui.tabs.find('.tabs_view-scroller').first().append(this.ui.toolbar);

    if (this.sectionSelection) {
      this.ui.tabs.find('.tabs_view-container').first().before(this.ui.selectionBar);
    }
  },

  setupSelectionBar() {
    this.listenTo(this.sectionSelection,
                  'add remove reset change:selecting',
                  this.updateSelectionBar);

    this.listenTo(this.options.entry.sections, 'remove', section =>
      this.sectionSelection.remove(section)
    );

    this.updateSelectionBar();
  },

  makeSelectionAndReorderingExclusive(viewModel) {
    this.listenTo(viewModel, 'change:collapsed', (model, collapsed) => {
      if (collapsed) {
        this.sectionSelection.stop();
      }
    });

    this.listenTo(this.sectionSelection, 'change:selecting add', () => {
      if (this.sectionSelection.isActive()) {
        viewModel.set('collapsed', false);
      }
    });
  },

  updateSelectionBar() {
    const selection = this.sectionSelection;

    this.ui.selectionBar.prop('hidden', !selection.isActive());
    this.ui.selectionBarText.text(
      I18n.t('pageflow_scrolled.editor.entry_outline.selected_sections',
             {count: selection.length})
    );

    this.ui.selectionBarAction.prop('disabled', !selection.length);
  }
});

const SelectSectionsMenuItem = Backbone.Model.extend({
  initialize(attributes, {sectionSelection}) {
    this.sectionSelection = sectionSelection;

    this.listenTo(sectionSelection, 'add remove reset change:selecting', this.updateLabel);
    this.updateLabel();
  },

  selected() {
    if (this.sectionSelection.isActive()) {
      this.sectionSelection.stop();
    }
    else {
      this.sectionSelection.start();
    }
  },

  updateLabel() {
    this.set('label', I18n.t(
      this.sectionSelection.isActive() ?
      'pageflow_scrolled.editor.entry_outline.end_selection' :
      'pageflow_scrolled.editor.entry_outline.select_sections'
    ));
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
