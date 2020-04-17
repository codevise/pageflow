import I18n from 'i18n-js';
import Marionette from 'backbone.marionette';

import {editor} from 'pageflow/editor';

import template from '../templates/editPageLink.jst';

export const EditPageLinkView = Marionette.Layout.extend({
  template,

  regions: {
    formContainer: '.form_container'
  },

  ui: {
    backButton: 'a.back'
  },

  events: {
    'click a.back': 'goBack',

    'click a.destroy': 'destroy'
  },

  onRender: function() {
    var pageType = this.options.api.pageTypes.findByPage(this.options.page);
    var configurationEditor = pageType.createPageLinkConfigurationEditorView({
      model: this.model,
      page: this.options.page
    });

    this.formContainer.show(configurationEditor);

    this.highlight();
  },

  highlight: function() {
    this.model.highlight();

    this.listenTo(this, 'close', function() {
      this.model.resetHighlight();
    });
  },

  destroy: function() {
    if (confirm(I18n.t('pageflow.internal_links.editor.views.edit_page_link_view.confirm_destroy'))) {
      this.model.remove();
      this.goBack();
    }
  },

  goBack: function() {
    editor.navigate('/pages/' + this.options.page.id + '/links', {trigger: true});
  }
});
