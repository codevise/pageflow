import {editor, buttonStyles} from 'pageflow-scrolled/editor';
import {ListView} from 'pageflow/editor';
import _ from 'underscore';
import {cssModulesUtils} from 'pageflow/ui';
import styles from './SidebarListView.module.css';
import Marionette from 'backbone.marionette';
import I18n from 'i18n-js';

export const SidebarListView = Marionette.Layout.extend({
  template: (data) => `
    <label>${I18n.t('pageflow_scrolled.editor.content_elements.externalLinkList.items')}</label>
    <div class='${styles.linksContainer}'></div>
    <button class="${buttonStyles.addButton}">
      ${I18n.t('pageflow_scrolled.editor.content_elements.externalLinkList.add')}
    </button>
  `,

  regions: cssModulesUtils.ui(styles, 'linksContainer'),

  events: cssModulesUtils.events(buttonStyles, {
    'click addButton': 'addElement'
  }),

  onRender: function () {
    this.listenTo(this.options.contentElement.configuration, 'change:textPosition', this.renderListView);
    this.renderListView();
  },

  renderListView() {
    this.linksContainer.show(new ListView({
      collection: this.collection,
      sortable: true,
      highlight: true,

      onEdit: _.bind(this.onEdit, this),
      onRemove: _.bind(this.onRemove, this)
    }));
  },

  addElement: function () {
    this.collection.addNewLink();
  },

  onEdit: function (linkModel) {
    this.options.contentElement.postCommand({type: 'SET_SELECTED_ITEM',
                                             index: this.collection.indexOf(linkModel)});

    editor.navigate(`/scrolled/external_links/${this.options.contentElement.id}/${linkModel.id}`, {trigger: true});
  },

  onRemove: function (linkModel) {
    if (window.confirm(I18n.t('pageflow_scrolled.editor.content_elements.externalLinkList.confirm_delete_item'))) {
      this.collection.remove(linkModel);
    }
  }
});
