pageflow.WidgetType = pageflow.Object.extend({
  initialize: function(serverSideConfig, clientSideConfig) {
    this.name = serverSideConfig.name;
    this.translationKey = serverSideConfig.translationKey;
    this.configurationEditorView = clientSideConfig.configurationEditorView;
    this.isOptional = clientSideConfig.isOptional;
    this.defaults = clientSideConfig.default_configurations;
  },

  hasConfiguration: function() {
    return !!this.configurationEditorView;
  },

  createConfigurationEditorView: function(options) {
    var constructor = this.configurationEditorView;
    if (this.defaults) {
      var modelAttributes = options.model.attributes;
      _.each(Object.keys(this.defaults), function (def_key) {
        if (!modelAttributes.hasOwnProperty(def_key)) {
          options.model.set(def_key,this[def_key]);
        }
      }, this.defaults);
    }
    return new constructor(_.extend({
      attributeTranslationKeyPrefixes: [
        'pageflow.editor.widgets.attributes.' + this.name,
        'pageflow.editor.widgets.common_attributes'
      ]
    }, options));
  }
});
