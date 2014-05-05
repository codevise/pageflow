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
    if (confirm("Kapitel einschließlich ALLER enthaltener Seiten wirklich löschen?\n\nDieser Schritt kann nicht rückgängig gemacht werden.")) {
      this.model.destroy();
      this.goBack();
    }
  },

  goBack: function() {
    editor.navigate('/', {trigger: true});
  }
});