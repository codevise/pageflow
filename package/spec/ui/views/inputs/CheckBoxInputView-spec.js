import Backbone from 'backbone';

import {CheckBoxInputView} from 'pageflow/ui';

describe('pageflow.CheckBoxInputView', () => {
  var Model = Backbone.Model.extend();

  it('loads value', () => {
    var model = new Model({value: true});
    var view = new CheckBoxInputView({
      model: model,
      propertyName: 'value'
    });

    view.render();

    expect(view.ui.input.is(':checked')).toEqual(true);
  });

  it('saves value on change', () => {
    var model = new Model();
    var view = new CheckBoxInputView({
      model: model,
      propertyName: 'value'
    });

    view.render();
    view.$el.find('input').prop('checked', true);
    view.$el.find('input').trigger('change');

    expect(model.get('value')).toEqual(true);
  });

  it('supports displaying unchecked if disabled', () => {
    var model = new Model({value: true});
    var view = new CheckBoxInputView({
      model: model,
      propertyName: 'value',
      disabled: true,
      displayUncheckedIfDisabled: true
    });

    view.render();

    expect(view.ui.input.is(':checked')).toEqual(false);
  });

  it('supports displaying checked if disabled', () => {
    var model = new Model({value: false});
    var view = new CheckBoxInputView({
      model: model,
      propertyName: 'value',
      disabled: true,
      displayCheckedIfDisabled: true
    });

    view.render();

    expect(view.ui.input.is(':checked')).toEqual(true);
  });

  it('supports attribute binding for disabled option', () => {
    var model = new Model({value: true, disabled: false});
    var view = new CheckBoxInputView({
      model: model,
      propertyName: 'value',
      disabledBinding: 'disabled',
      displayUncheckedIfDisabled: true
    });

    view.render();

    expect(view.ui.input.is(':checked')).toEqual(true);
    model.set('disabled', true);
    expect(view.ui.input.is(':checked')).toEqual(false);
    model.set('disabled', false);
    expect(view.ui.input.is(':checked')).toEqual(true);
  });

  it('updates displayed value when disabled option returns true or undefined', () => {
    var model = new Model({state: false});
    var view = new CheckBoxInputView({
      model: model,
      propertyName: 'value',
      disabledBinding: 'state',
      disabled: function(state) { return state; },
      displayCheckedIfDisabled: true
    });

    view.render();

    expect(view.ui.input.is(':checked')).toEqual(false);
    model.set('state', true);
    expect(view.ui.input.is(':checked')).toEqual(true);
    model.set('state', false);
    expect(view.ui.input.is(':checked')).toEqual(false);
  });

  describe('with storeInverted option', () => {
    it('displays checked by default', () => {
      var model = new Model();
      var view = new CheckBoxInputView({
        model: model,
        propertyName: 'value',
        storeInverted: 'invertedValue'
      });

      view.render();

      expect(view.ui.input.is(':checked')).toEqual(true);
    });

    it('displays unchecked if true in model', () => {
      var model = new Model({invertedValue: true});
      var view = new CheckBoxInputView({
        model: model,
        propertyName: 'value',
        storeInverted: 'invertedValue'
      });

      view.render();

      expect(view.ui.input.is(':checked')).toEqual(false);
    });

    it('displays checked if false in model', () => {
      var model = new Model({invertedValue: false});
      var view = new CheckBoxInputView({
        model: model,
        propertyName: 'value',
        storeInverted: 'invertedValue'
      });

      view.render();

      expect(view.ui.input.is(':checked')).toEqual(true);
    });

    it('saves inverted value on change', () => {
      var model = new Model();
      var view = new CheckBoxInputView({
        model: model,
        propertyName: 'value',
        storeInverted: 'invertedValue'
      });

      view.render();
      view.$el.find('input').prop('checked', true);
      view.$el.find('input').trigger('change');

      expect(model.get('invertedValue')).toEqual(false);
    });
  })
});
