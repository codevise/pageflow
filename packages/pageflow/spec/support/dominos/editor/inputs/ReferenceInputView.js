support.dom.ReferenceInputView = support.dom.Base.extend({
  clickChooseButton: function() {
    this.$el.find('.choose').trigger('click');
  }
});
