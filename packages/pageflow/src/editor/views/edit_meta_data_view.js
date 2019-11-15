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
      this.input('title', pageflow.TextInputView, {
        placeholder: entry.get('entry_title')
      });
      this.input('locale', pageflow.SelectInputView, {
        values: pageflow.config.availablePublicLocales,
        texts: _.map(pageflow.config.availablePublicLocales, function(locale) {
          return I18n.t('pageflow.public._language', {locale: locale});
        })
      });

      this.input('credits', pageflow.TextAreaInputView);

      this.input('author', pageflow.TextInputView, {
        placeholder: pageflow.config.defaultAuthorMetaTag
      });
      this.input('publisher', pageflow.TextInputView, {
        placeholder: pageflow.config.defaultPublisherMetaTag
      });
      this.input('keywords', pageflow.TextInputView, {
        placeholder: pageflow.config.defaultKeywordsMetaTag
      });
    });

    configurationEditor.tab('widgets', function() {
      var theme = entry.getTheme();

      this.input('manual_start', pageflow.CheckBoxInputView);
      this.input('emphasize_chapter_beginning', pageflow.CheckBoxInputView);
      this.input('emphasize_new_pages', pageflow.CheckBoxInputView);
      this.input('home_button_enabled', pageflow.CheckBoxInputView, {
        disabled: !theme.hasHomeButton(),
        displayUncheckedIfDisabled: true
      });
      this.input('overview_button_enabled', pageflow.CheckBoxInputView, {
        disabled: !theme.hasOverviewButton(),
        displayUncheckedIfDisabled: true
      });
      if (theme.hasHomeButton()) {
        this.input('home_url', pageflow.TextInputView, {
          placeholder: pageflow.theming.get('pretty_url'),
          visibleBinding: 'home_button_enabled'
        });
      }
      this.view(pageflow.EditWidgetsView, {
        model: entry,
        widgetTypes: pageflow.editor.widgetTypes
      });
      if (pageflow.features.isEnabled('selectable_themes') &&
          pageflow.themes.length > 1) {
        this.view(pageflow.ThemeInputView, {
          themes: pageflow.themes,
          propertyName: 'theme_name'
        });
      }
    });

    configurationEditor.tab('social', function() {
      this.input('share_image_id', pageflow.FileInputView, {
        collection: pageflow.imageFiles,
        fileSelectionHandler: 'entryConfiguration'
      });
      this.input('summary', pageflow.TextAreaInputView, {
        disableRichtext: true,
        disableLinks: true
      });
      this.input('share_url', pageflow.TextInputView, {
        placeholder: pageflow.entry.get('pretty_url')
      });
      this.input('share_providers', pageflow.CheckBoxGroupInputView, {
        values: pageflow.config.availableShareProviders,
        translationKeyPrefix: 'activerecord.values.pageflow/entry.share_providers'
      });
    });

    this.listenTo(entry.configuration, 'change:theme_name', function() {
      configurationEditor.refresh();
    });

    this.formContainer.show(configurationEditor);
  },

  goBack: function() {
    editor.navigate('/', {trigger: true});
  }
});
