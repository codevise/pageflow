import Marionette from 'backbone.marionette';
import Backbone from 'backbone';
import I18n from 'i18n-js';
import {cssModulesUtils} from 'pageflow/ui';
import {DropDownButtonView} from 'pageflow/editor';
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
      this.markedSections.stop();
    },

    'click selectionBarAction': function() {
      const menuItem = new ExtractSectionsFragmentMenuItem({}, {
        entry: this.options.entry,
        sections: this.markedSections.models.slice()
      });

      ExtractFragmentDialogView.show({
        onSubmit: title => {
          this.markedSections.stop();
          menuItem.extract(title);
        }
      });
    }
  }),

  initialize() {
    if (features.isEnabled('fragments')) {
      this.markedSections = this.options.entry.markedSections;
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

    if (this.markedSections) {
      dropDownMenuItems.add(new SelectSectionsMenuItem({}, {
        markedSections: this.markedSections
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
        markedSections: this.markedSections
      }
    });

    this.listenTo(storylinesTabsView, 'change', () => {
      viewModel.set('collapsed', false);
      this.markedSections?.stop();
    });

    this.appendSubview(storylinesTabsView, {to: this.ui.tabs});

    this.ui.tabs.find('.tabs_view-scroller').first().append(this.ui.toolbar);

    if (this.markedSections) {
      this.ui.tabs.find('.tabs_view-container').first().before(this.ui.selectionBar);
    }
  },

  onClose() {
    this.markedSections?.stop();
  },

  setupSelectionBar() {
    this.listenTo(this.markedSections,
                  'add remove reset change:selecting',
                  this.updateSelectionBar);

    this.updateSelectionBar();
  },

  makeSelectionAndReorderingExclusive(viewModel) {
    this.listenTo(viewModel, 'change:collapsed', (model, collapsed) => {
      if (collapsed) {
        this.markedSections.stop();
      }
    });

    this.listenTo(this.markedSections, 'change:selecting add', () => {
      if (this.markedSections.isActive()) {
        viewModel.set('collapsed', false);
      }
    });
  },

  updateSelectionBar() {
    const selection = this.markedSections;

    this.ui.selectionBar.prop('hidden', !selection.isActive());
    this.ui.selectionBarText.text(
      I18n.t('pageflow_scrolled.editor.entry_outline.selected_sections',
             {count: selection.length})
    );

    this.ui.selectionBarAction.prop('disabled', !selection.length);
  }
});

const SelectSectionsMenuItem = Backbone.Model.extend({
  initialize(attributes, {markedSections}) {
    this.markedSections = markedSections;

    this.listenTo(markedSections, 'add remove reset change:selecting', this.updateLabel);
    this.updateLabel();
  },

  selected() {
    if (this.markedSections.isActive()) {
      this.markedSections.stop();
    }
    else {
      this.markedSections.start();
    }
  },

  updateLabel() {
    this.set('label', I18n.t(
      this.markedSections.isActive() ?
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
