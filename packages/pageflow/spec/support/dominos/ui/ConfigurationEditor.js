support.dom.ConfigurationEditor = support.dom.Base.extend({
  selector: '.configuration_editor',

  tabNames: function() {
    return support.dom.Tabs.find(this.$el).tabNames();
  },

  tabLabels: function() {
    return support.dom.Tabs.find(this.$el).tabLabels();
  },

  inputPropertyNames: function() {
    return support.dom.ConfigurationEditorTab.find(this.$el).inputPropertyNames();
  }
});
