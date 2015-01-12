pageflow.EditPageView = Backbone.Marionette.Layout.extend({
  template: 'templates/edit_page',
  className: 'edit_page',

  mixins: [pageflow.failureIndicatingView],

  regions: {
    pageTypeContainer: '.page_type',
    configurationContainer: '.configuration_container'
  },

  events: {
    'click a.back': 'goBack',
    'click a.destroy': 'destroy'
  },

  modelEvents: {
    'change:template': 'load'
  },

  onRender: function() {
    this.pageTypeContainer.show(new pageflow.ExtendedSelectInputView({
      model: this.model,
      propertyName: 'template',
      collection: pageflow.Page.types,
      valueProperty: 'name',
      translationKeyProperty: 'translation_key',

      groupTranslationKeyProperty: 'category_translation_key',
      pictogramClassProperty: 'type_pictogram',
      descriptionTranslationKeyProperty: 'description_translation_key'
    }));

    this.load();
    this.model.trigger('edit', this.model);
  },

  load: function() {
    this.configurationContainer.show(pageflow.ConfigurationEditorView.create(this.model.get('template'), {
      model: this.model.configuration,
      tab: this.options.tab
    }));
  },

  destroy: function() {
    if (confirm("Seite wirklich löschen?")) {
      this.model.destroy();
      this.goBack();
    }
  },

  goBack: function() {
    editor.navigate('/', {trigger: true});
  }
});