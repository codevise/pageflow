import $ from 'jquery';
import I18n from 'i18n-js';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';

import {DropDownButtonView} from 'pageflow/editor';
import {features} from 'pageflow/frontend';
import {TabsView, cssModulesUtils} from 'pageflow/ui';

import {
  DestroyContentElementsMenuItem,
  ExtractContentElementsFragmentMenuItem
} from '../models/contentElementMenuItems';

import defaultPictogram from './images/defaultPictogram.svg';
import styles from './MultiSelectionView.module.css';

export const MultiSelectionView = Marionette.ItemView.extend({
  className: styles.root,

  template: () => `
    <a class="back">${I18n.t('pageflow.editor.templates.back_button_decorator.outline')}</a>
    <div class="${styles.actions}"></div>
    <div class="${styles.tabs}"></div>
    <div class="${styles.selectionModeHint}">
      <span>${I18n.t('pageflow_scrolled.editor.multi_selection_view.selection_mode_hint')}</span>
      <button type="button" class="${styles.endSelectionMode}">
        ${I18n.t('pageflow_scrolled.editor.multi_selection_view.end_selection_mode')}
      </button>
    </div>
  `,

  ui: cssModulesUtils.ui(styles, 'actions', 'tabs', 'selectionModeHint'),

  events: {
    'click a.back': 'goBack',

    ...cssModulesUtils.events(styles, {
      'click endSelectionMode': function() {
        this.options.entry.trigger('endSelectionMode');
      }
    })
  },

  onRender() {
    const {entry, items} = this.options;

    const contentElements = sortByDocumentOrder(
      entry,
      items
        .map(({id}) => entry.contentElements.get(id))
        .filter(contentElement => contentElement?.section)
    );

    const fragments = features.isEnabled('fragments');

    this.appendSubview(new DropDownButtonView({
      items: new Backbone.Collection([
        ...(fragments ?
            [new ExtractContentElementsFragmentMenuItem({}, {entry, items})] :
            []),
        new DestroyContentElementsMenuItem({separated: fragments}, {entry, items})
      ]),
      label: I18n.t('pageflow.editor.views.edit_configuration.actions'),
      ellipsisIcon: true,
      openOnClick: true,
      alignMenu: 'right'
    }), {to: this.ui.actions});

    const tabsView = new TabsView();

    tabsView.tab('contentElements', () => new ContentElementsListView({contentElements}), {
      label: I18n.t('pageflow_scrolled.editor.multi_selection_view.tab',
                    {count: contentElements.length})
    });

    this.appendSubview(tabsView, {to: this.ui.tabs});

    if (this.options.selectionMode) {
      this.ui.tabs.find('.tabs_view-container').first().before(this.ui.selectionModeHint);
    }
    else {
      this.ui.selectionModeHint.remove();
    }
  },

  // Resetting the selection in the preview makes it navigate back to
  // the outline.
  goBack() {
    this.options.entry.trigger('resetSelection');
  }
});

const ContentElementsListView = Marionette.ItemView.extend({
  className: `list ${styles.list}`,

  template: () => '<ul class="list_items"></ul>',

  ui: {
    items: '.list_items'
  },

  onRender() {
    this.ui.items.append(this.options.contentElements.map(renderItem));
  }
});

function sortByDocumentOrder(entry, contentElements) {
  return [...contentElements].sort((a, b) =>
    entry.sections.indexOf(a.section) - entry.sections.indexOf(b.section) ||
    a.section.contentElements.indexOf(a) - b.section.contentElements.indexOf(b)
  );
}

function renderItem(contentElement) {
  const type = contentElement.getType();
  const item = $('<li />', {class: 'list_item'});
  const thumbnail = $('<span />', {class: 'list_item_thumbnail'});

  thumbnail.append($('<span />', {
    class: styles.pictogram,
    style: `mask-image: url('${escapeCssUrl(type.pictogram || defaultPictogram)}')`
  }));

  item.append(thumbnail);
  item.append($('<div />', {class: 'list_item_title', text: type.displayName}));

  return item[0];
}

function escapeCssUrl(url) {
  return url.replace(/'/g, "\\'").replace(/\n/g, '');
}
