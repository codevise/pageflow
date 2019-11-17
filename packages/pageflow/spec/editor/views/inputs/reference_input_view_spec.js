describe('pageflow.ReferenceInputView', function() {
  var Model = Backbone.Model.extend({
    i18nKey: 'page'
  });

  var Target = Backbone.Model.extend({
    title: function() {
      return this.get('title');
    },

    thumbnailUrl: function() {
      return 'http://www.example.com/thumbnail.jpg';
    }
  });

  var TestView = pageflow.ReferenceInputView.extend({
    getTarget: function() {
      return this.options.target;
    }
  });

  it('displays title of target if there is a target', function() {
    var view = new TestView({
      model: new Model(),
      property_name: 'custom_attribute',
      target: new Target({
        title: 'Money, money, money'
      })
    });

    view.render();

    expect(view.ui.title.text()).to.equal('Money, money, money');
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

  describe('view implementing choose', function() {
    var TestViewWithChoose = TestView.extend({
      choose: function() {
        return $.Deferred(function(deferred) {
          deferred.resolve(new Backbone.Model ({
            perma_id: 46
          }));
        });
      }
    });

    it('sets model attribute to perma_id of model that choose resolves to',
       function() {
         var model = new Model();
         var view = new TestViewWithChoose({
           model: model,
           propertyName: 'some_id'
         });

         support.dom.ReferenceInputView.render(view).clickChooseButton();

         expect(model.get('some_id')).to.equal(46);
       }
      );
  });

  describe('view implementing chooseValue', function() {
    var TestViewWithChooseValue = TestView.extend({
      chooseValue: function() {
        return $.Deferred(function(deferred) {
          deferred.resolve(47);
        });
      }
    });

    it('sets model attribute to chooseValue resolution',
       function() {
         var model = new Model();
         var view = new TestViewWithChooseValue({
           model: model,
           propertyName: 'an_id'
         });

         support.dom.ReferenceInputView.render(view).clickChooseButton();

         expect(model.get('an_id')).to.equal(47);
       }
      );
  });

  describe('choose button title', function() {
    it('has default value', function() {
      var model = new Model();
      var view = new TestView({
        model: model,
        propertyName: 'an_id'
      });

      view.render();

      expect(view.ui.chooseButton).to.have.$attr('title');
    });

    it('can be set via option', function() {
      var model = new Model();
      var view = new TestView({
        model: model,
        propertyName: 'an_id',
        chooseButtonTitle: 'Change value'
      });

      view.render();

      expect(view.ui.chooseButton).to.have.$attr('title', 'Change value');
    });
  });

  describe('unset button title', function() {
    it('has default value', function() {
      var model = new Model();
      var view = new TestView({
        model: model,
        propertyName: 'an_id'
      });

      view.render();

      expect(view.ui.unsetButton).to.have.$attr('title');
    });

    it('can be set via option', function() {
      var model = new Model();
      var view = new TestView({
        model: model,
        propertyName: 'an_id',
        unsetButtonTitle: 'No value'
      });

      view.render();

      expect(view.ui.unsetButton).to.have.$attr('title', 'No value');
    });
  });
});
