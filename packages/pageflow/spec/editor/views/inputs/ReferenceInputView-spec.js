import $ from 'jquery';
import Backbone from 'backbone';

import {ReferenceInputView} from '$pageflow/editor';

import * as support from '$support';
import {ReferenceInputView} from '$support/dominos/editor';

describe('pageflow.ReferenceInputView', () => {
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

  var TestView = ReferenceInputView.extend({
    getTarget: function() {
      return this.options.target;
    }
  });

  test('displays title of target if there is a target', () => {
    var view = new TestView({
      model: new Model(),
      property_name: 'custom_attribute',
      target: new Target({
        title: 'Money, money, money'
      })
    });

    view.render();

    expect(view.ui.title.text()).toBe('Money, money, money');
  });

  describe('with disabled option', () => {
    test('sets disabled attributes on buttons', () => {
      var view = new TestView({
        model: new Model(),
        propertyName: 'some_id',
        disabled: true
      });

      view.render();

      expect(view.ui.buttons).to.have.$attr('disabled');
    });
  });

  describe('with hideUnsetButton', () => {
    test('hides the unset button', () => {
      var view = new TestView({
        model: new Model(),
        propertyName: 'some_id',
        hideUnsetButton: true
      });

      view.render();

      expect(view.ui.unsetButton.css('display')).toBe('none');
    });
  });

  describe('view implementing choose', () => {
    var TestViewWithChoose = TestView.extend({
      choose: function() {
        return $.Deferred(function(deferred) {
          deferred.resolve(new Backbone.Model ({
            perma_id: 46
          }));
        });
      }
    });

    test(
      'sets model attribute to perma_id of model that choose resolves to',
      () => {
        var model = new Model();
        var view = new TestViewWithChoose({
          model: model,
          propertyName: 'some_id'
        });

        ReferenceInputView.render(view).clickChooseButton();

        expect(model.get('some_id')).toBe(46);
      }
    );
  });

  describe('view implementing chooseValue', () => {
    var TestViewWithChooseValue = TestView.extend({
      chooseValue: function() {
        return $.Deferred(function(deferred) {
          deferred.resolve(47);
        });
      }
    });

    test('sets model attribute to chooseValue resolution', () => {
      var model = new Model();
      var view = new TestViewWithChooseValue({
        model: model,
        propertyName: 'an_id'
      });

      ReferenceInputView.render(view).clickChooseButton();

      expect(model.get('an_id')).toBe(47);
    });
  });

  describe('choose button title', () => {
    test('has default value', () => {
      var model = new Model();
      var view = new TestView({
        model: model,
        propertyName: 'an_id'
      });

      view.render();

      expect(view.ui.chooseButton).to.have.$attr('title');
    });

    test('can be set via option', () => {
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

  describe('unset button title', () => {
    test('has default value', () => {
      var model = new Model();
      var view = new TestView({
        model: model,
        propertyName: 'an_id'
      });

      view.render();

      expect(view.ui.unsetButton).to.have.$attr('title');
    });

    test('can be set via option', () => {
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
