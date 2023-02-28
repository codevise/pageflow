import Backbone from 'backbone';

import {NumberInputView} from 'pageflow/ui';

describe('pageflow.NumberInputView', () => {
  it('supports disabled option', () => {
    var model = new Backbone.Model({});
    var numberInputView = new NumberInputView({
      model: model,
      propertyName: 'value',
      disabled: true
    });

    numberInputView.render();
    var input = numberInputView.$el.find('input');

    expect(input).toHaveAttr('disabled', 'disabled');
  });

  it('displays localized value ', () => {
    var model = new Backbone.Model({
      value: 1.5
    });
    var numberInputView = new NumberInputView({
      model: model,
      propertyName: 'value',
      locale: 'de'
    });

    numberInputView.render();

    var input = numberInputView.$el.find('input');

    expect(input).toHaveValue('1,5');
  });

  it('parses localized value and stores number', () => {
    var model = new Backbone.Model();
    var numberInputView = new NumberInputView({
      model: model,
      propertyName: 'value',
      locale: 'de'
    });

    numberInputView.render();

    var input = numberInputView.$el.find('input');
    input.val('1,3');
    input.trigger('change');

    expect(model.get('value')).toEqual(1.3);
  });

  it('removes group separators', () => {
    var model = new Backbone.Model();
    var numberInputView = new NumberInputView({
      model: model,
      propertyName: 'value',
      locale: 'en'
    });

    numberInputView.render();

    var input = numberInputView.$el.find('input');
    input.val('100,000');
    input.trigger('change');

    expect(model.get('value')).toEqual(100000);
    expect(input).toHaveValue('100000');
  });

  it('stores 0 by default', () => {
    var model = new Backbone.Model();
    var numberInputView = new NumberInputView({
      model: model,
      propertyName: 'value',
      locale: 'en'
    });

    numberInputView.render();

    var input = numberInputView.$el.find('input');
    input.val('');
    input.trigger('change');

    expect(model.get('value')).toEqual(0);
    expect(input).toHaveValue('0');
  });

  it('stores 0 for invalid value', () => {
    var model = new Backbone.Model();
    var numberInputView = new NumberInputView({
      model: model,
      propertyName: 'value',
      locale: 'en'
    });

    numberInputView.render();

    var input = numberInputView.$el.find('input');
    input.val('not a number');
    input.trigger('change');

    expect(model.get('value')).toEqual(0);
    expect(input).toHaveValue('0');
  });
});
