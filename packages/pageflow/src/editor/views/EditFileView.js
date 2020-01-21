import Marionette from 'backbone.marionette';
import _ from 'underscore';

import {ConfigurationEditorTabView, TextInputView, UrlDisplayView} from 'pageflow/ui';

import {state} from '$state';

import template from '../templates/editFile.jst';

export const EditFileView = Marionette.ItemView.extend({
  template,
  className: 'edit_file',

  onRender: function() {
    var fileType = this.model.fileType();
    var entry = this.options.entry || state.entry;

    var tab = new ConfigurationEditorTabView({
      model: this.model.configuration,
      attributeTranslationKeyPrefixes: [
        'pageflow.editor.files.attributes.' + fileType.collectionName,
        'pageflow.editor.files.common_attributes',
        'pageflow.editor.nested_files.' + fileType.collectionName,
        'pageflow.editor.nested_files.common_attributes'
      ]
    });

    tab.input('file_name', TextInputView, {
      model: this.model,
      disabled: true
    });

    tab.input('rights', TextInputView, {
      model: this.model,
      placeholder: entry.get('default_file_rights')
    });

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
