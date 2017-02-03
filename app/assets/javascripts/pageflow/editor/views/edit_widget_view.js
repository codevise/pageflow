pageflow.EditWidgetView = Backbone.Marionette.ItemView.extend({
  template: 'templates/edit_widget',
  className: 'edit_widget',

  events: {
    'click a.back': function() {
      editor.navigate('/meta_data/widgets', {trigger: true});
    }
  },

  onRender: function() {
    var configurationEditor = this.model.widgetType().createConfigurationEditorView({
      model: this.model.configuration,
      tab: this.options.tab
    });

    this.appendSubview(configurationEditor);
  }
});
