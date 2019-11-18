import Backbone from 'backbone';
import sinon from 'sinon';

import {ColorInputView} from '$pageflow/ui';

import * as support from '$support';
import {ColorInput} from '$support/dominos/ui'

describe('pageflow.ColorInputView', () => {
  let testContext;

  beforeEach(() => {
    testContext = {};
  });

  support.useHtmlSandbox(() => testContext);

  beforeEach(() => {
    testContext.clock = sinon.useFakeTimers();
  });

  afterEach(() => {
    testContext.clock.restore();
  });

  it('loads value into input', () => {
    var model = new Backbone.Model({
      color: '#ababab'
    });
    var colorInputView = new ColorInputView({
      model: model,
      propertyName: 'color'
    });

    var colorInput = ColorInput.render(colorInputView);

    expect(colorInput.value()).toBe('#ababab');
  });

  it('updates input when model changes', () => {
    var model = new Backbone.Model();
    var colorInputView = new ColorInputView({
      model: model,
      propertyName: 'color'
    });

    var colorInput = ColorInput.render(colorInputView);
    model.set('color', '#ababab');

    expect(colorInput.value()).toBe('#ababab');
  });

  it('saves value to model on change', () => {
    var model = new Backbone.Model({
      color: '#ababab'
    });
    var colorInputView = new ColorInputView({
      model: model,
      propertyName: 'color'
    });

    var colorInput = ColorInput.render(
      colorInputView,
      {appendTo: testContext.htmlSandbox}
    );
    colorInput.fillIn('#bbb', testContext.clock);

    expect(model.get('color')).toBe('#bbbbbb');
  });

  it('allows passing swatches', () => {
    var model = new Backbone.Model();
    var colorInputView = new ColorInputView({
      model: model,
      propertyName: 'color',
      swatches: ['#cdcdcd', '#dedede']
    });

    var colorInput = ColorInput.render(
      colorInputView,
      {appendTo: testContext.htmlSandbox}
    );

    expect(colorInput.swatches()).toEqual(['rgb(205, 205, 205)', 'rgb(222, 222, 222)']);
  });

  describe('with defaultValue option', () => {
    it('falls back to default value', () => {
      var model = new Backbone.Model();
      var colorInputView = new ColorInputView({
        model: model,
        propertyName: 'color',
        defaultValue: '#cdcdcd'
      });

      var colorInput = ColorInput.render(
        colorInputView
      );

      expect(colorInput.value()).toBe('#cdcdcd');
    });

    it('does not store default value in model', () => {
      var model = new Backbone.Model();
      var colorInputView = new ColorInputView({
        model: model,
        propertyName: 'color',
        defaultValue: '#cdcdcd'
      });

      var colorInput = ColorInput.render(
        colorInputView,
        {appendTo: testContext.htmlSandbox}
      );
      colorInput.fillIn('#cdcdcd', testContext.clock);

      expect(model.has('color')).toBe(false);
    });

    it('stores non default value in model', () => {
      var model = new Backbone.Model();
      var colorInputView = new ColorInputView({
        model: model,
        propertyName: 'color',
        defaultValue: '#cdcdcd'
      });

      var colorInput = ColorInput.render(
        colorInputView,
        {appendTo: testContext.htmlSandbox}
      );
      colorInput.fillIn('#ababab', testContext.clock);

      expect(model.get('color')).toBe('#ababab');
    });

    it('unsets attribute in model if choosing default value', () => {
      var model = new Backbone.Model({
        color: '#fff'
      });
      var colorInputView = new ColorInputView({
        model: model,
        propertyName: 'color',
        defaultValue: '#cdcdcd'
      });

      var colorInput = ColorInput.render(
        colorInputView,
        {appendTo: testContext.htmlSandbox}
      );
      colorInput.fillIn('#cdcdcd', testContext.clock);

      expect(model.has('color')).toBe(false);
    });

    it('includes swatch for default value', () => {
      var model = new Backbone.Model();
      var colorInputView = new ColorInputView({
        model: model,
        propertyName: 'color',
        defaultValue: '#cdcdcd',
        swatches: ['#dedede']
      });

      var colorInput = ColorInput.render(
        colorInputView,
        {appendTo: testContext.htmlSandbox}
      );

      expect(colorInput.swatches()).toEqual(['rgb(205, 205, 205)', 'rgb(222, 222, 222)']);
    });

    it('does not duplicate swatch', () => {
      var model = new Backbone.Model();
      var colorInputView = new ColorInputView({
        model: model,
        propertyName: 'color',
        defaultValue: '#cdcdcd',
        swatches: ['#dedede', '#cdcdcd']
      });

      var colorInput = ColorInput.render(
        colorInputView,
        {appendTo: testContext.htmlSandbox}
      );

      expect(colorInput.swatches()).toEqual(['rgb(205, 205, 205)', 'rgb(222, 222, 222)']);
    });
  });

  describe('with function as defaultValue option', () => {
    it('falls back to default value', () => {
      var model = new Backbone.Model();
      var colorInputView = new ColorInputView({
        model: model,
        propertyName: 'color',
        defaultValue: function() { return '#cdcdcd'; }
      });

      var colorInput = ColorInput.render(
        colorInputView
      );

      expect(colorInput.value()).toBe('#cdcdcd');
    });

    it('does not store default value in model', () => {
      var model = new Backbone.Model();
      var colorInputView = new ColorInputView({
        model: model,
        propertyName: 'color',
        defaultValue: function() { return '#cdcdcd'; }
      });

      var colorInput = ColorInput.render(
        colorInputView,
        {appendTo: testContext.htmlSandbox}
      );
      colorInput.fillIn('#cdcdcd', testContext.clock);

      expect(model.has('color')).toBe(false);
    });

    it('stores non default value in model', () => {
      var model = new Backbone.Model();
      var colorInputView = new ColorInputView({
        model: model,
        propertyName: 'color',
        defaultValue: function() { return '#cdcdcd'; }
      });

      var colorInput = ColorInput.render(
        colorInputView,
        {appendTo: testContext.htmlSandbox}
      );
      colorInput.fillIn('#ababab', testContext.clock);

      expect(model.get('color')).toBe('#ababab');
    });

    it('unsets attribute in model if choosing default value', () => {
      var model = new Backbone.Model({
        color: '#fff'
      });
      var colorInputView = new ColorInputView({
        model: model,
        propertyName: 'color',
        defaultValue: function() { return '#cdcdcd'; }
      });

      var colorInput = ColorInput.render(
        colorInputView,
        {appendTo: testContext.htmlSandbox}
      );
      colorInput.fillIn('#cdcdcd', testContext.clock);

      expect(model.has('color')).toBe(false);
    });

    it('includes swatch for default value', () => {
      var model = new Backbone.Model();
      var colorInputView = new ColorInputView({
        model: model,
        propertyName: 'color',
        defaultValue: function() { return '#cdcdcd'; },
        swatches: ['#dedede']
      });

      var colorInput = ColorInput.render(
        colorInputView,
        {appendTo: testContext.htmlSandbox}
      );

      expect(colorInput.swatches()).toEqual(['rgb(205, 205, 205)', 'rgb(222, 222, 222)']);
    });
  });

  describe('with defaultValueBinding option', () => {
    it('uses value of binding attribute as default value', () => {
      var model = new Backbone.Model({
        default_color: '#cdcdcd'
      });
      var colorInputView = new ColorInputView({
        model: model,
        propertyName: 'color',
        defaultValueBinding: 'default_color'
      });

      var colorInput = ColorInput.render(
        colorInputView
      );

      expect(colorInput.value()).toBe('#cdcdcd');
    });

    it(
      'updates displayed default value when binding attribute changes',
      () => {
        var model = new Backbone.Model({
          default_color: '#aaaaaa'
        });
        var colorInputView = new ColorInputView({
          model: model,
          propertyName: 'color',
          defaultValueBinding: 'default_color'
        });

        var colorInput = ColorInput.render(
          colorInputView
        );
        model.set('default_color', '#cdcdcd');

        expect(colorInput.value()).toBe('#cdcdcd');
      }
    );

    it('does not store default value in model', () => {
      var model = new Backbone.Model({
        default_color: '#cdcdcd'
      });
      var colorInputView = new ColorInputView({
        model: model,
        propertyName: 'color',
        defaultValueBinding: 'default_color'
      });

      var colorInput = ColorInput.render(
        colorInputView,
        {appendTo: testContext.htmlSandbox}
      );
      model.set('default_color', '#aaaaaa');
      colorInput.fillIn('#aaaaaa', testContext.clock);

      expect(model.has('color')).toBe(false);
    });

    it('stores non default value in model', () => {
      var model = new Backbone.Model({
        default_color: '#cdcdcd'
      });
      var colorInputView = new ColorInputView({
        model: model,
        propertyName: 'color',
        defaultValueBinding: 'default_color'
      });

      var colorInput = ColorInput.render(
        colorInputView,
        {appendTo: testContext.htmlSandbox}
      );
      model.set('default_color', '#aaaaaa');
      colorInput.fillIn('#cdcdcd', testContext.clock);

      expect(model.get('color')).toBe('#cdcdcd');
    });

    it('unsets attribute in model if choosing default value', () => {
      var model = new Backbone.Model({
        color: '#fff'
      });
      var colorInputView = new ColorInputView({
        model: model,
        propertyName: 'color',
        defaultValueBinding: 'default_color'
      });

      var colorInput = ColorInput.render(
        colorInputView,
        {appendTo: testContext.htmlSandbox}
      );
      model.set('default_color', '#cdcdcd');
      colorInput.fillIn('#cdcdcd', testContext.clock);

      expect(model.has('color')).toBe(false);
    });
  });

  describe('with function as defaultValue and defaultValueBinding option', () => {
    it('passes binding attribute to default value function', () => {
      var model = new Backbone.Model({
        light: true
      });
      var colorInputView = new ColorInputView({
        model: model,
        propertyName: 'color',
        defaultValueBinding: 'light',
        defaultValue: function(light) { return light ? '#fefefe' : '#010101'; }
      });

      var colorInput = ColorInput.render(
        colorInputView
      );

      expect(colorInput.value()).toBe('#fefefe');
    });

    it(
      'updates displayed default value when binding attribute changes',
      () => {
        var model = new Backbone.Model({
          light: true
        });
        var colorInputView = new ColorInputView({
          model: model,
          propertyName: 'color',
          defaultValueBinding: 'light',
          defaultValue: function(light) { return light ? '#fefefe' : '#010101'; }
        });

        var colorInput = ColorInput.render(
          colorInputView
        );
        model.set('light', false);

        expect(colorInput.value()).toBe('#010101');
      }
    );

    it('does not store default value in model', () => {
      var model = new Backbone.Model({
        light: true
      });
      var colorInputView = new ColorInputView({
        model: model,
        propertyName: 'color',
        defaultValueBinding: 'light',
        defaultValue: function(light) { return light ? '#fefefe' : '#010101'; }
      });

      var colorInput = ColorInput.render(
        colorInputView,
        {appendTo: testContext.htmlSandbox}
      );
      model.set('light', false);
      colorInput.fillIn('#010101', testContext.clock);

      expect(model.has('color')).toBe(false);
    });

    it('stores non default value in model', () => {
      var model = new Backbone.Model({
        light: true
      });
      var colorInputView = new ColorInputView({
        model: model,
        propertyName: 'color',
        defaultValueBinding: 'light',
        defaultValue: function(light) { return light ? '#fefefe' : '#010101'; }
      });

      var colorInput = ColorInput.render(
        colorInputView,
        {appendTo: testContext.htmlSandbox}
      );
      model.set('light', false);
      colorInput.fillIn('#fefefe', testContext.clock);

      expect(model.get('color')).toBe('#fefefe');
    });

    it('unsets attribute in model if choosing default value', () => {
      var model = new Backbone.Model({
        light: true
      });
      var colorInputView = new ColorInputView({
        model: model,
        propertyName: 'color',
        defaultValueBinding: 'light',
        defaultValue: function(light) { return light ? '#fefefe' : '#010101'; }
      });

      var colorInput = ColorInput.render(
        colorInputView,
        {appendTo: testContext.htmlSandbox}
      );
      model.set('light', false);
      colorInput.fillIn('#010101', testContext.clock);

      expect(model.has('color')).toBe(false);
    });
  });
});
