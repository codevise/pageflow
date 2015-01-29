pageflow.EditChapterView = Backbone.Marionette.Layout.extend({
  template: 'templates/edit_chapter',
  className: 'edit_chapter',

  mixins: [pageflow.failureIndicatingView],

  regions: {
    formContainer: '.form_container'
  },

  events: {
    'click a.back': 'goBack',
    'click a.destroy': 'destroy',
  },

  onRender: function() {
    this.formContainer.show(new pageflow.TextInputView({
      model: this.model,
      propertyName: 'title'
    }));
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