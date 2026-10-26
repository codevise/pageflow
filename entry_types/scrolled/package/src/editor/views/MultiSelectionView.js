import $ from 'jquery';
import I18n from 'i18n-js';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';

import {DropDownButtonView} from 'pageflow/editor';
import {TabsView, cssModulesUtils} from 'pageflow/ui';

import {DestroyContentElementsMenuItem} from '../models/contentElementMenuItems';

import defaultPictogram from './images/defaultPictogram.svg';
import styles from './MultiSelectionView.module.css';

export const MultiSelectionView = Marionette.ItemView.extend({
  className: styles.root,

  template: () => `
    <a class="back">${I18n.t('pageflow.editor.templates.back_button_decorator.outline')}</a>
    <div class="${styles.actions}"></div>
    <div class="${styles.tabs}"></div>
  `,

  ui: cssModulesUtils.ui(styles, 'actions', 'tabs'),

  events: {
    'click a.back': 'goBack'
  },

  onRender() {
    const {entry, items} = this.options;
    const contentElements = sortByDocumentOrder(
      entry,
      items
        .map(({id}) => entry.contentElements.get(id))
        .filter(contentElement => contentElement?.section)
    );

    this.appendSubview(new DropDownButtonView({
      items: new Backbone.Collection([
        new DestroyContentElementsMenuItem({}, {entry, items})
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
