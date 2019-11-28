import Backbone from 'backbone';

import {TextInputView} from '$pageflow/ui';

describe('pageflow.TextInputView', () => {
  it('supports disabled option', () => {
    var model = new Backbone.Model({});
    var textInputView = new TextInputView({
      model: model,
      propertyName: 'name',
      disabled: true
    });

    textInputView.render();
    var input = textInputView.$el.find('input');

    expect(input).toHaveAttr('disabled', 'disabled');
  });

  it('supports placeholder text', () => {
    var model = new Backbone.Model({});
    var textInputView = new TextInputView({
      model: model,
      propertyName: 'name',
      placeholder: 'Default'
    });

    textInputView.render();
    var input = textInputView.$el.find('input');

    expect(input).toHaveAttr('placeholder', 'Default');
  });

  it('supports placeholder as function', () => {
    var model = new Backbone.Model({other: 'otherValue'});
    var textInputView = new TextInputView({
      model: model,
      propertyName: 'name',
      placeholder: function(m) {
        return m.get('other');
      }
    });

    textInputView.render();
    var input = textInputView.$el.find('input');

    expect(input).toHaveAttr('placeholder', 'otherValue');
  });

  it(
    'updates placeholder when placeholderBinding attribute changes',
    () => {
      var model = new Backbone.Model({other: 'old'});
      var textInputView = new TextInputView({
        model: model,
        propertyName: 'name',
        placeholder: function(m) {
          return m.get('other');
        },
        placeholderBinding: 'other'
      });

      textInputView.render();
      var input = textInputView.$el.find('input');
      model.set('other', 'new');

      expect(input).toHaveAttr('placeholder', 'new');
    }
  );

  it('supports reading placeholder from other model', () => {
    var placeholderModel = new Backbone.Model({name: 'otherValue'});
    var model = new Backbone.Model({});
    var textInputView = new TextInputView({
      model: model,
      propertyName: 'name',
      placeholderModel: placeholderModel
    });

    textInputView.render();
    var input = textInputView.$el.find('input');

    expect(input).toHaveAttr('placeholder', 'otherValue');
  });

  describe('max length validation', () => {
    describe('for existing data exceeding specified maxLength', () => {
      it('skips validation', () => {
        var legacyTitle = new Array(300).join();
        var model = new Backbone.Model({title: legacyTitle});
        var textInputView = new TextInputView({
          model: model,
          propertyName: 'title'
        });

        textInputView.render();

        expect(textInputView.$el.hasClass('invalid')).toBe(false);
      });
    });

    describe('for new entries and data shorter than specified maxLength', () => {
      it('validates maximum character count with maxLength option', () => {
        var model = new Backbone.Model({});
        var textInputView = new TextInputView({
          model: model,
          propertyName: 'title'
        });

        textInputView.render();

        var input = textInputView.$el.find('input');
        input.val(new Array(300).join());
        input.trigger('change');

        expect(textInputView.$el.hasClass('invalid')).toBe(true);
      });
    });
  });
});
