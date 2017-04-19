describe('pageflow.ReferenceInputView', function() {
  var Model = Backbone.Model.extend({
    i18nKey: 'page'
  });

  var TestView = pageflow.ReferenceInputView.extend({
    getTarget: function() {
      return null;
    }
  });

  describe('with disabled option', function() {
    it('sets disabled attributes on buttons', function() {
      var view = new TestView({
        model: new Model(),
        propertyName: 'some_id',
        disabled: true
      });

      view.render();

      expect(view.ui.buttons).to.have.$attr('disabled');
    });
  });
});