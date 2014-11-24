/*global editor*/

pageflow.EditMetaDataView = Backbone.Marionette.Layout.extend({
  template: 'templates/edit_meta_data',
  className: 'edit_meta_data',

  mixins: [pageflow.failureIndicatingView],

  regions: {
    formContainer: '.form_fields'
  },

  events: {
    'click a.back': 'goBack'
  },

  onRender: function() {
    var entry = this.model;

    var configurationEditor = new pageflow.ConfigurationEditorView({
      model: entry.configuration,
      tab: this.options.tab
    });

    configurationEditor.tab('general', function() {
      this.input('title', pageflow.TextInputView);
      this.input('locale', pageflow.SelectInputView, {
        values: pageflow.config.availableLocales,
        texts: _.map(pageflow.config.availableLocales, function(locale) {
          return I18n.t('language', {locale: locale});
        })
      });

      this.input('credits', pageflow.TextAreaInputView);
    });

    configurationEditor.tab('widgets', function() {
      this.input('manual_start', pageflow.CheckBoxInputView);
      this.input('emphasize_chapter_beginning', pageflow.CheckBoxInputView);
      this.input('emphasize_new_pages', pageflow.CheckBoxInputView);
      this.input('home_button_enabled', pageflow.CheckBoxInputView, {
        disabled: !pageflow.theming.hasHomeButton(),
        displayUncheckedIfDisabled: true
      });
      if (pageflow.theming.hasHomeButton()) {
        this.input('home_url', pageflow.TextInputView, {
          placeholder: pageflow.theming.get('pretty_url'),
          visibleBinding: 'home_button_enabled'
        });
      }
      this.view(pageflow.EditWidgetsView, {
        model: entry,
        widgetTypes: pageflow.editor.widgetTypes
      });
    });

    configurationEditor.tab('social', function() {
      this.input('share_image_id', pageflow.FileInputView, {
        collection: pageflow.imageFiles,
        fileSelectionHandler: 'entryConfiguration'
      });
      this.input('summary', pageflow.TextAreaInputView);
    });

    this.formContainer.show(configurationEditor);
  },

  goBack: function() {
    editor.navigate('/', {trigger: true});
  }
});