import Backbone from 'backbone';

import {SliderInputView} from 'pageflow/ui';

describe('pageflow.SliderInputView', () => {
  var Model = Backbone.Model.extend();

  it('loads value', () => {
    var model = new Model({value: 75});
    var view = new SliderInputView({
      model: model,
      propertyName: 'value'
    });

    view.render();

    expect(view.ui.widget.slider('value')).toEqual(75);
  });

  it('displays value', () => {
    var model = new Model({value: 75});
    var view = new SliderInputView({
      model: model,
      propertyName: 'value'
    });

    view.render();

    expect(view.ui.value.text()).toEqual('75%');
  });

  it('updates value when model changes', () => {
    var model = new Model({value: 75});
    var view = new SliderInputView({
      model: model,
      propertyName: 'value'
    });

    view.render();
    model.set('value', 10)

    expect(view.ui.widget.slider('value')).toEqual(10);
  });

  it('updates text when model changes', () => {
    var model = new Model({value: 75});
    var view = new SliderInputView({
      model: model,
      propertyName: 'value'
    });

    view.render();
    model.set('value', 10)

    expect(view.ui.value.text()).toEqual('10%');
  });

  it('supports displaying custom unit', () => {
    var model = new Model({value: 75});
    var view = new SliderInputView({
      model: model,
      propertyName: 'value',
      unit: 's'
    });

    view.render();

    expect(view.ui.value.text()).toEqual('75s');
  });

  it('supports displaying custom text', () => {
    var model = new Model({value: 75});
    var view = new SliderInputView({
      model: model,
      propertyName: 'value',
      displayText: value => `€ ${value}`
    });

    view.render();

    expect(view.ui.value.text()).toEqual('€ 75');
  });

  it('saves value on slidechange', () => {
    var model = new Model();
    var view = new SliderInputView({
      model: model,
      propertyName: 'value'
    });

    view.render();
    view.$el.trigger('slidechange', {value: 75});

    expect(model.get('value')).toEqual(75);
  });

  it('does not save value on slide by default', () => {
    var model = new Model({value: 0});
    var view = new SliderInputView({
      model: model,
      propertyName: 'value'
    });

    view.render();
    view.$el.trigger('slide', {value: 75});

    expect(model.get('value')).toEqual(0);
  });

  it('supports saving value on slide', () => {
    var model = new Model();
    var view = new SliderInputView({
      model: model,
      propertyName: 'value',
      saveOnSlide: true
    });

    view.render();
    view.$el.trigger('slide', {value: 75});

    expect(model.get('value')).toEqual(75);
  });

  it('updates displayed value on slide', () => {
    var model = new Model();
    var view = new SliderInputView({
      model: model,
      propertyName: 'value'
    });

    view.render();
    view.$el.trigger('slide', {value: 75});

    expect(view.ui.value.text()).toEqual('75%');
  });

  it('supports minValue option', () => {
    var model = new Model({});
    var view = new SliderInputView({
      model: model,
      propertyName: 'value',
      minValue: 10
    });

    view.render();

    expect(view.ui.widget.slider('option', 'min')).toEqual(10);
  });

  it('supports maxValue option', () => {
    var model = new Model({});
    var view = new SliderInputView({
      model: model,
      propertyName: 'value',
      maxValue: 10
    });

    view.render();

    expect(view.ui.widget.slider('option', 'max')).toEqual(10);
  });
});
