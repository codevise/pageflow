describe('pageflow.ReferenceInputView', function() {
  var f = support.factories;

  var Model = Backbone.Model.extend({
    i18nKey: 'page'
  });

  var TestView = pageflow.ReferenceInputView.extend({
    getTarget: function() {
      return null;
    }
  });

  var TestViewWithChoose = TestView.extend({
    choose: function() {
      return $.Deferred(function(deferred) {
        deferred.resolve(new Backbone.Model ({
          perma_id: 'this id are belong to us'
        }));
      });
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

  describe('with hideUnsetButton', function() {
    it('hides the unset button', function() {
      var view = new TestView({
        model: new Model(),
        propertyName: 'some_id',
        hideUnsetButton: true
      });

      view.render();

      expect(view.ui.unsetButton.css('display')).to.eq('none');
    });
  });

  describe('default chooseValue()', function() {
    it('returns perma_id of the result of choose()', function() {
      var view = new TestViewWithChoose({
        model: new Model(),
        propertyName: 'some_id'
      });

      view.render();

      expect(view.chooseValue()).to.contain('belong to us');
    });
  });
});
