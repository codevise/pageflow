support.dom.ConfigurationEditorTab = support.dom.Base.extend({
  selector: '.configuration_editor_tab',

  inputPropertyNames: function() {
    return this.$el.find('.input').map(function() {
      return $(this).data('inputPropertyName');
    }).get();
  }
});
