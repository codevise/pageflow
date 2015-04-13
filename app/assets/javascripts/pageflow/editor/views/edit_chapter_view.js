pageflow.EditChapterView = Backbone.Marionette.Layout.extend({
  template: 'templates/edit_chapter',
  className: 'edit_chapter',

  mixins: [pageflow.failureIndicatingView],

  regions: {
    formContainer: '.form_container'
  },

  events: {
    'click a.back': 'goBack',
    'click a.destroy': 'destroy'
  },

  onRender: function() {
    var configurationEditor = new pageflow.ConfigurationEditorView({
      model: this.model.configuration
    });

    this.configure(configurationEditor);
    this.formContainer.show(configurationEditor);
  },

  configure: function(configurationEditor) {
    var view = this;

    configurationEditor.tab('general', function() {
      this.input('title', pageflow.TextInputView, {
        model: view.model
      });

      if (pageflow.features.isEnabled('chapter_hierachy')) {
        this.input('parent_page_perma_id', pageflow.PageLinkInputView);
      }
    });
  },

  destroy: function() {
    if (confirm(I18n.t('pageflow.editor.views.edit_chapter_view.confirm_destroy'))) {
      this.model.destroy();
      this.goBack();
    }
  },

  goBack: function() {
    editor.navigate('/', {trigger: true});
  }
});