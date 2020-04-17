import _ from 'underscore';

import {Object} from 'pageflow/ui';

export const WidgetType = Object.extend({
  initialize: function(serverSideConfig, clientSideConfig) {
    this.name = serverSideConfig.name;
    this.translationKey = serverSideConfig.translationKey;
    this.configurationEditorView = clientSideConfig.configurationEditorView;
    this.isOptional = clientSideConfig.isOptional;
  },

  hasConfiguration: function() {
    return !!this.configurationEditorView;
  },

  createConfigurationEditorView: function(options) {
    var constructor = this.configurationEditorView;
    return new constructor(_.extend({
      attributeTranslationKeyPrefixes: [
        'pageflow.editor.widgets.attributes.' + this.name,
        'pageflow.editor.widgets.common_attributes'
      ]
    }, options));
  }
});
