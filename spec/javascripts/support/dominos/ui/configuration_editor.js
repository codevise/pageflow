support.dom.ConfigurationEditor = support.dom.Base.extend({
  selector: '.configuration_editor',

  inputPropertyNames: function() {
    return support.dom.ConfigurationEditorTab.find(this.$el).inputPropertyNames();
  }
});
