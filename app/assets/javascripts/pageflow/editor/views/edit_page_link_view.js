pageflow.EditPageLinkView = Backbone.Marionette.Layout.extend({
  template: 'pageflow/editor/templates/edit_page_link',

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
    pageflow.editor.navigate('/pages/' + this.options.page.id + '/links', {trigger: true});
  }
});
