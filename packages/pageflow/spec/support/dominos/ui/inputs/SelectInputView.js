support.dom.SelectInputView = support.dom.Base.extend({
  selector: 'select',

  values: function() {
    return this.$el.find('option').map(function() {
      return $(this).attr('value');
    }).get();
  }
});
