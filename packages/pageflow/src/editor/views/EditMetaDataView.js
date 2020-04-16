import I18n from 'i18n-js';
import Marionette from 'backbone.marionette';
import _ from 'underscore';

import {CheckBoxGroupInputView, ConfigurationEditorView, SelectInputView, TextAreaInputView, TextInputView} from 'pageflow/ui';

import {EditWidgetsView} from './EditWidgetsView';
import {FileInputView} from './inputs/FileInputView';
import {ThemeInputView} from './inputs/ThemeInputView';
import {failureIndicatingView} from './mixins/failureIndicatingView';

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
    var state = this.options.state || {};
    var features = this.options.features || {};
    var editor = this.options.editor || {};

    var configurationEditor = new ConfigurationEditorView({
      model: entry.metadata.configuration,
      tab: this.options.tab,
      attributeTranslationKeyPrefixes: [
        'pageflow.entry_types.' + editor.entryType.name +
          '.editor.entry_metadata_configuration_attributes'
      ]
    });

    configurationEditor.tab('general', function() {
      this.input('title', TextInputView, {
        placeholder: entry.get('entry_title'),
        model: entry.metadata
      });
      this.input('locale', SelectInputView, {
        values: state.config.availablePublicLocales,
        texts: _.map(state.config.availablePublicLocales, function(locale) {
          return I18n.t('pageflow.public._language', {locale: locale});
        }),
        model: entry.metadata
      });

      this.input('credits', TextAreaInputView, {
        model: entry.metadata
      });

      this.input('author', TextInputView, {
        placeholder: state.config.defaultAuthorMetaTag,
        model: entry.metadata
      });
      this.input('publisher', TextInputView, {
        placeholder: state.config.defaultPublisherMetaTag,
        model: entry.metadata
      });
      this.input('keywords', TextInputView, {
        placeholder: state.config.defaultKeywordsMetaTag,
        model: entry.metadata
      });
    });

    configurationEditor.tab('widgets', function() {
      editor.entryType.appearanceInputs &&
        editor.entryType.appearanceInputs(this, {
          entry,
          theming: state.theming
        });
      entry.widgets && this.view(EditWidgetsView, {
        model: entry,
        widgetTypes: editor.widgetTypes
      });

      if (features.isEnabled &&
          features.isEnabled('selectable_themes') &&
          state.themes.length > 1) {
        this.view(ThemeInputView, {
          themes: state.themes,
          propertyName: 'theme_name',
          model: entry.metadata
        });
      }
    });

    configurationEditor.tab('social', function() {
      this.input('share_image_id', FileInputView, {
        collection: state.imageFiles,
        fileSelectionHandler: 'entryMetadata',
        model: entry.metadata
      });
      this.input('summary', TextAreaInputView, {
        disableRichtext: true,
        disableLinks: true,
        model: entry.metadata
      });
      this.input('share_url', TextInputView, {
        placeholder: state.entry.get('pretty_url'),
        model: entry.metadata
      });
      this.input('share_providers', CheckBoxGroupInputView, {
        values: state.config.availableShareProviders,
        translationKeyPrefix: 'activerecord.values.pageflow/entry.share_providers',
        model: entry.metadata
      });
    });

    this.listenTo(entry.metadata, 'change:theme_name', function() {
      configurationEditor.refresh();
    });

    this.formContainer.show(configurationEditor);
  },

  goBack: function() {
    this.options.editor.navigate('/', {trigger: true});
  }
});
