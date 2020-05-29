import {editor} from 'pageflow-scrolled/editor';
import {ListView} from 'pageflow/editor';
import _ from 'underscore';
import {cssModulesUtils} from 'pageflow/ui';
import styles from './SidebarListView.module.css';
import Marionette from 'backbone.marionette';
import I18n from 'i18n-js';

export const SidebarListView = Marionette.Layout.extend({
  template: (data) => `
    <a class="back">${I18n.t('pageflow_scrolled.editor.content_elements.externalLinkList.outline')}</a>
    <a class="destroy">${I18n.t('pageflow_scrolled.editor.content_elements.externalLinkList.destroy')}</a>
    <div class="${styles.container}">
      <label class="${styles.header}">
        <span class="name">${I18n.t('pageflow_scrolled.editor.content_elements.externalLinkList.name')}</span>
      </label>
      <div class='${styles.links_container}'></div>
      <a class="${styles.add}" href="">${I18n.t('pageflow_scrolled.editor.content_elements.externalLinkList.add')}</a>
    </div>
  `,
  className: 'manage_external_links',
  regions: {
    linksContainer: '.'+styles.links_container,
  },
  ui: cssModulesUtils.ui(styles, 'add', 'header'),
  events: function () {
    var eventObject = {
      'click a.back': 'goBack',
      'click a.destroy': 'destroyElement',
    };
    eventObject['click a.'+styles.add] = 'addElement';
    return eventObject;
  },
  initialize: function(options) {
    this.listenTo(options.contentElement.configuration, 'change', function() {
      this.render();
    });
  },
  onRender: function () {
    this.linksContainer.show(new ListView({
      collection: this.model,
      onEdit: _.bind(this.onEdit, this),
      onRemove: _.bind(this.onRemove, this),
      contentElement: this.options.contentElement
    }));
  },
  goBack: function() {
    editor.navigate('', {trigger: true});
  },
  destroyElement: function () {
    if (window.confirm(I18n.t('pageflow_scrolled.editor.content_elements.externalLinkList.confirm_delete'))) {
      this.options.contentElement.destroy();
      this.goBack();
    }
  },
  addElement: function () {
    var newModel = this.model.addNewLink();
    this.onEdit(newModel);
  },
  onEdit: function (linkModel) {
    editor.navigate(`/scrolled/external_links/${this.options.contentElement.get('id')}/${linkModel.get('id')}`, {trigger: true});
  },
  onRemove: function (linkModel) {
    if (window.confirm(I18n.t('pageflow_scrolled.editor.content_elements.externalLinkList.confirm_delete_link'))) {
      this.model.remove(linkModel);
    }
  }
});
