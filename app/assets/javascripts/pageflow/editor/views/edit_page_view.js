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
      collection: this.options.api.pageTypes.pluck('seed'),
      valueProperty: 'name',
      translationKeyProperty: 'translation_key',
      groupTranslationKeyProperty: 'category_translation_key',
      descriptionTranslationKeyProperty: 'description_translation_key',

      pictogramClass: 'type_pictogram',

      helpLinkClicked: function(value) {
        var pageType = this.options.api.pageTypes.findByName(value);
        pageflow.app.trigger('toggle-help', pageType.seed.help_entry_translation_key);
      }
    }));

    this.load();
    this.model.trigger('edit', this.model);
  },

  onShow: function() {
    this.configurationEditor.refreshScroller();
  },

  load: function() {
    this.configurationEditor = this.options.api.createPageConfigurationEditorView(this.model, {
      tab: this.options.tab
    });

    this.configurationContainer.show(this.configurationEditor);
  },

  destroy: function() {
    if (confirm(I18n.t('pageflow.editor.views.edit_page_view.confirm_destroy'))) {
      this.model.destroy();
      this.goBack();
    }
  },

  goBack: function() {
    editor.navigate('/', {trigger: true});
  }
});
