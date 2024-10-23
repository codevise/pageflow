import _ from 'underscore';
import {Object} from 'pageflow/ui';

export const WidgetType = Object.extend({
  initialize: function(serverSideConfig, clientSideConfig) {
    this.name = serverSideConfig.name;
    this.translationKey = serverSideConfig.translationKey;
    this.insertPoint = serverSideConfig.insertPoint;
    this.configurationEditorView = clientSideConfig.configurationEditorView;
    this.configurationEditorTabViewGroups = clientSideConfig.configurationEditorTabViewGroups || {};
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
  },

  defineStubConfigurationEditorTabViewGroups(groups) {
    _.each(this.configurationEditorTabViewGroups, (fn, name) =>
      groups.define(name, () => {})
    );
  },

  defineConfigurationEditorTabViewGroups(groups) {
    _.each(this.configurationEditorTabViewGroups, (fn, name) =>
      groups.define(name, fn)
    );
  }
});
