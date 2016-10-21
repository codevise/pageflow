support.dom.ConfigurationEditor = support.dom.Base.extend({
  selector: '.configuration_editor',

  inputPropertyNames: function() {
    return this.$el.find('.input').map(function() {
      return $(this).data('inputPropertyName');
    }).get();
  }
});