import Marionette from 'backbone.marionette';
import _ from 'underscore';
import I18n from 'i18n-js';

import {ConfigurationEditorTabView, SelectInputView, SeparatorView, TextInputView, UrlDisplayView} from 'pageflow/ui';
import {editor} from '../base';

import {state} from '$state';

import template from '../templates/editFile.jst';

export const EditFileView = Marionette.ItemView.extend({
  template,
  className: 'edit_file',

  onRender: function() {
    var fileType = this.model.fileType();
    var entry = this.options.entry || state.entry;

    var entryTypeName = editor.entryType.name;

    var tab = new ConfigurationEditorTabView({
      model: this.model.configuration,
      attributeTranslationKeyPrefixes: [
        'pageflow.entry_types.' + entryTypeName + '.editor.files.attributes.' + fileType.collectionName,
        'pageflow.entry_types.' + entryTypeName + '.editor.files.common_attributes',
        'pageflow.editor.files.attributes.' + fileType.collectionName,
        'pageflow.editor.files.common_attributes',
        'pageflow.editor.nested_files.' + fileType.collectionName,
        'pageflow.editor.nested_files.common_attributes'
      ]
    });

    if (this.options.displayFileName) {
      tab.input('file_name', TextInputView, {
        model: this.model,
        disabled: true
      });
    }

    tab.input('rights', TextInputView, {
      model: this.model,
      placeholder: entry.get('default_file_rights')
    });

    if (editor.entryType.supportsExtendedFileRights &&
        !fileType.noExtendedFileRights) {
      tab.input('source_url', TextInputView);
      tab.input('license', SelectInputView, {
        includeBlank: true,
        blankTranslationKey: 'pageflow.editor.files.common_attributes.license.blank',
        values: state.config.availableFileLicenses,
        texts: state.config.availableFileLicenses.map(name => I18n.t(`pageflow.file_licenses.${name}.name`))
      });
      tab.input('rights_display', SelectInputView, {
        values: ['credits', 'inline']
      });
    }

    tab.view(SeparatorView);

    _(this.fileTypeInputs()).each(function(options) {
      tab.input(options.name, options.inputView, options.inputViewOptions);
    });

    tab.input('original_url', UrlDisplayView, {
      model: this.model
    });

    this.appendSubview(tab);
  },

  fileTypeInputs: function() {
    var fileType = this.model.fileType();

    return _.chain(fileType.configurationEditorInputs).map(function(inputs) {
      if (_.isFunction(inputs)) {
        return inputs(this.model);
      }
      else {
        return inputs;
      }
    }, this).flatten().value();
  }
});
