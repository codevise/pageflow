import I18n from 'i18n-js';
import Marionette from 'backbone.marionette';
import _ from 'underscore';

import {CheckBoxGroupInputView, CheckBoxInputView, ConfigurationEditorView, SelectInputView, TextAreaInputView, TextInputView} from '$pageflow/ui';

import {editor} from '../base';

import {EditWidgetsView} from './EditWidgetsView';
import {FileInputView} from './inputs/FileInputView';
import {ThemeInputView} from './inputs/ThemeInputView';
import {failureIndicatingView} from './mixins/failureIndicatingView';

import {state} from '$state';

import template from '../templates/editMetaData.jst';

export const EditMetaDataView = Marionette.Layout.extend({
  template,
  className: 'edit_meta_data',

  mixins: [failureIndicatingView],

  regions: {
    formContainer: '.form_fields'
  },

  events: {
    'click a.back': 'goBack'
  },

  onRender: function() {
    var entry = this.model;

    var configurationEditor = new ConfigurationEditorView({
      model: entry.configuration,
      tab: this.options.tab
    });

    configurationEditor.tab('general', function() {
      this.input('title', TextInputView, {
        placeholder: entry.get('entry_title')
      });
      this.input('locale', SelectInputView, {
        values: state.config.availablePublicLocales,
        texts: _.map(state.config.availablePublicLocales, function(locale) {
          return I18n.t('pageflow.public._language', {locale: locale});
        })
      });

      this.input('credits', TextAreaInputView);

      this.input('author', TextInputView, {
        placeholder: state.config.defaultAuthorMetaTag
      });
      this.input('publisher', TextInputView, {
        placeholder: state.config.defaultPublisherMetaTag
      });
      this.input('keywords', TextInputView, {
        placeholder: state.config.defaultKeywordsMetaTag
      });
    });

    configurationEditor.tab('widgets', function() {
      var theme = entry.getTheme();

      this.input('manual_start', CheckBoxInputView);
      this.input('emphasize_chapter_beginning', CheckBoxInputView);
      this.input('emphasize_new_pages', CheckBoxInputView);
      this.input('home_button_enabled', CheckBoxInputView, {
        disabled: !theme.hasHomeButton(),
        displayUncheckedIfDisabled: true
      });
      this.input('overview_button_enabled', CheckBoxInputView, {
        disabled: !theme.hasOverviewButton(),
        displayUncheckedIfDisabled: true
      });
      if (theme.hasHomeButton()) {
        this.input('home_url', TextInputView, {
          placeholder: state.theming.get('pretty_url'),
          visibleBinding: 'home_button_enabled'
        });
      }
      this.view(EditWidgetsView, {
        model: entry,
        widgetTypes: editor.widgetTypes
      });
      if (pageflow.features.isEnabled('selectable_themes') &&
          state.themes.length > 1) {
        this.view(ThemeInputView, {
          themes: state.themes,
          propertyName: 'theme_name'
        });
      }
    });

    configurationEditor.tab('social', function() {
      this.input('share_image_id', FileInputView, {
        collection: state.imageFiles,
        fileSelectionHandler: 'entryConfiguration'
      });
      this.input('summary', TextAreaInputView, {
        disableRichtext: true,
        disableLinks: true
      });
      this.input('share_url', TextInputView, {
        placeholder: state.entry.get('pretty_url')
      });
      this.input('share_providers', CheckBoxGroupInputView, {
        values: state.config.availableShareProviders,
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
