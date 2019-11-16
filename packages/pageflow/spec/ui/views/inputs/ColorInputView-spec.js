import Backbone from 'backbone';

import {ColorInputView} from '$pageflow/ui';

import * as support from '$support';

describe('pageflow.ColorInputView', () => {
  let testContext;

  beforeEach(() => {
    testContext = {};
  });

  support.useHtmlSandbox();

  beforeEach(() => {
    testContext.clock = sinon.useFakeTimers();
  });

  afterEach(() => {
    testContext.clock.restore();
  });

  test('loads value into input', () => {
    var model = new Backbone.Model({
      color: '#ababab'
    });
    var colorInputView = new ColorInputView({
      model: model,
      propertyName: 'color'
    });

    var colorInputViewDomino = support.dom.ColorInputView.render(colorInputView);

    expect(colorInputViewDomino.value()).toBe('#ababab');
  });

  test('updates input when model changes', () => {
    var model = new Backbone.Model();
    var colorInputView = new ColorInputView({
      model: model,
      propertyName: 'color'
    });

    var colorInputViewDomino = support.dom.ColorInputView.render(colorInputView);
    model.set('color', '#ababab');

    expect(colorInputViewDomino.value()).toBe('#ababab');
  });

  test('saves value to model on change', () => {
    var model = new Backbone.Model({
      color: '#ababab'
    });
    var colorInputView = new ColorInputView({
      model: model,
      propertyName: 'color'
    });

    var colorInputViewDomino = support.dom.ColorInputView.render(
      colorInputView,
      {appendTo: testContext.htmlSandbox}
    );
    colorInputViewDomino.fillIn('#bbb', testContext.clock);

    expect(model.get('color')).toBe('#bbbbbb');
  });

  test('allows passing swatches', () => {
    var model = new Backbone.Model();
    var colorInputView = new ColorInputView({
      model: model,
      propertyName: 'color',
      swatches: ['#cdcdcd', '#dedede']
    });

    var colorInputViewDomino = support.dom.ColorInputView.render(
      colorInputView,
      {appendTo: testContext.htmlSandbox}
    );

    expect(colorInputViewDomino.swatches()).toEqual(['rgb(205, 205, 205)', 'rgb(222, 222, 222)']);
  });

  describe('with defaultValue option', () => {
    test('falls back to default value', () => {
      var model = new Backbone.Model();
      var colorInputView = new ColorInputView({
        model: model,
        propertyName: 'color',
        defaultValue: '#cdcdcd'
      });

      var colorInputViewDomino = support.dom.ColorInputView.render(
        colorInputView
      );

      expect(colorInputViewDomino.value()).toBe('#cdcdcd');
    });

    test('does not store default value in model', () => {
      var model = new Backbone.Model();
      var colorInputView = new ColorInputView({
        model: model,
        propertyName: 'color',
        defaultValue: '#cdcdcd'
      });

      var colorInputViewDomino = support.dom.ColorInputView.render(
        colorInputView,
        {appendTo: testContext.htmlSandbox}
      );
      colorInputViewDomino.fillIn('#cdcdcd', testContext.clock);

      expect(model.has('color')).toBe(false);
    });

    test('stores non default value in model', () => {
      var model = new Backbone.Model();
      var colorInputView = new ColorInputView({
        model: model,
        propertyName: 'color',
        defaultValue: '#cdcdcd'
      });

      var colorInputViewDomino = support.dom.ColorInputView.render(
        colorInputView,
        {appendTo: testContext.htmlSandbox}
      );
      colorInputViewDomino.fillIn('#ababab', testContext.clock);

      expect(model.get('color')).toBe('#ababab');
    });

    test('unsets attribute in model if choosing default value', () => {
      var model = new Backbone.Model({
        color: '#fff'
      });
      var colorInputView = new ColorInputView({
        model: model,
        propertyName: 'color',
        defaultValue: '#cdcdcd'
      });

      var colorInputViewDomino = support.dom.ColorInputView.render(
        colorInputView,
        {appendTo: testContext.htmlSandbox}
      );
      colorInputViewDomino.fillIn('#cdcdcd', testContext.clock);

      expect(model.has('color')).toBe(false);
    });

    test('includes swatch for default value', () => {
      var model = new Backbone.Model();
      var colorInputView = new ColorInputView({
        model: model,
        propertyName: 'color',
        defaultValue: '#cdcdcd',
        swatches: ['#dedede']
      });

      var colorInputViewDomino = support.dom.ColorInputView.render(
        colorInputView,
        {appendTo: testContext.htmlSandbox}
      );

      expect(colorInputViewDomino.swatches()).toEqual(['rgb(205, 205, 205)', 'rgb(222, 222, 222)']);
    });

    test('does not duplicate swatch', () => {
      var model = new Backbone.Model();
      var colorInputView = new ColorInputView({
        model: model,
        propertyName: 'color',
        defaultValue: '#cdcdcd',
        swatches: ['#dedede', '#cdcdcd']
      });

      var colorInputViewDomino = support.dom.ColorInputView.render(
        colorInputView,
        {appendTo: testContext.htmlSandbox}
      );

      expect(colorInputViewDomino.swatches()).toEqual(['rgb(205, 205, 205)', 'rgb(222, 222, 222)']);
    });
  });

  describe('with function as defaultValue option', () => {
    test('falls back to default value', () => {
      var model = new Backbone.Model();
      var colorInputView = new ColorInputView({
        model: model,
        propertyName: 'color',
        defaultValue: function() { return '#cdcdcd'; }
      });

      var colorInputViewDomino = support.dom.ColorInputView.render(
        colorInputView
      );

      expect(colorInputViewDomino.value()).toBe('#cdcdcd');
    });

    test('does not store default value in model', () => {
      var model = new Backbone.Model();
      var colorInputView = new ColorInputView({
        model: model,
        propertyName: 'color',
        defaultValue: function() { return '#cdcdcd'; }
      });

      var colorInputViewDomino = support.dom.ColorInputView.render(
        colorInputView,
        {appendTo: testContext.htmlSandbox}
      );
      colorInputViewDomino.fillIn('#cdcdcd', testContext.clock);

      expect(model.has('color')).toBe(false);
    });

    test('stores non default value in model', () => {
      var model = new Backbone.Model();
      var colorInputView = new ColorInputView({
        model: model,
        propertyName: 'color',
        defaultValue: function() { return '#cdcdcd'; }
      });

      var colorInputViewDomino = support.dom.ColorInputView.render(
        colorInputView,
        {appendTo: testContext.htmlSandbox}
      );
      colorInputViewDomino.fillIn('#ababab', testContext.clock);

      expect(model.get('color')).toBe('#ababab');
    });

    test('unsets attribute in model if choosing default value', () => {
      var model = new Backbone.Model({
        color: '#fff'
      });
      var colorInputView = new ColorInputView({
        model: model,
        propertyName: 'color',
        defaultValue: function() { return '#cdcdcd'; }
      });

      var colorInputViewDomino = support.dom.ColorInputView.render(
        colorInputView,
        {appendTo: testContext.htmlSandbox}
      );
      colorInputViewDomino.fillIn('#cdcdcd', testContext.clock);

      expect(model.has('color')).toBe(false);
    });

    test('includes swatch for default value', () => {
      var model = new Backbone.Model();
      var colorInputView = new ColorInputView({
        model: model,
        propertyName: 'color',
        defaultValue: function() { return '#cdcdcd'; },
        swatches: ['#dedede']
      });

      var colorInputViewDomino = support.dom.ColorInputView.render(
        colorInputView,
        {appendTo: testContext.htmlSandbox}
      );

      expect(colorInputViewDomino.swatches()).toEqual(['rgb(205, 205, 205)', 'rgb(222, 222, 222)']);
    });
  });

  describe('with defaultValueBinding option', () => {
    test('uses value of binding attribute as default value', () => {
      var model = new Backbone.Model({
        default_color: '#cdcdcd'
      });
      var colorInputView = new ColorInputView({
        model: model,
        propertyName: 'color',
        defaultValueBinding: 'default_color'
      });

      var colorInputViewDomino = support.dom.ColorInputView.render(
        colorInputView
      );

      expect(colorInputViewDomino.value()).toBe('#cdcdcd');
    });

    test(
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

        var colorInputViewDomino = support.dom.ColorInputView.render(
          colorInputView
        );
        model.set('default_color', '#cdcdcd');

        expect(colorInputViewDomino.value()).toBe('#cdcdcd');
      }
    );

    test('does not store default value in model', () => {
      var model = new Backbone.Model({
        default_color: '#cdcdcd'
      });
      var colorInputView = new ColorInputView({
        model: model,
        propertyName: 'color',
        defaultValueBinding: 'default_color'
      });

      var colorInputViewDomino = support.dom.ColorInputView.render(
        colorInputView,
        {appendTo: testContext.htmlSandbox}
      );
      model.set('default_color', '#aaaaaa');
      colorInputViewDomino.fillIn('#aaaaaa', testContext.clock);

      expect(model.has('color')).toBe(false);
    });

    test('stores non default value in model', () => {
      var model = new Backbone.Model({
        default_color: '#cdcdcd'
      });
      var colorInputView = new ColorInputView({
        model: model,
        propertyName: 'color',
        defaultValueBinding: 'default_color'
      });

      var colorInputViewDomino = support.dom.ColorInputView.render(
        colorInputView,
        {appendTo: testContext.htmlSandbox}
      );
      model.set('default_color', '#aaaaaa');
      colorInputViewDomino.fillIn('#cdcdcd', testContext.clock);

      expect(model.get('color')).toBe('#cdcdcd');
    });

    test('unsets attribute in model if choosing default value', () => {
      var model = new Backbone.Model({
        color: '#fff'
      });
      var colorInputView = new ColorInputView({
        model: model,
        propertyName: 'color',
        defaultValueBinding: 'default_color'
      });

      var colorInputViewDomino = support.dom.ColorInputView.render(
        colorInputView,
        {appendTo: testContext.htmlSandbox}
      );
      model.set('default_color', '#cdcdcd');
      colorInputViewDomino.fillIn('#cdcdcd', testContext.clock);

      expect(model.has('color')).toBe(false);
    });
  });

  describe('with function as defaultValue and defaultValueBinding option', () => {
    test('passes binding attribute to default value function', () => {
      var model = new Backbone.Model({
        light: true
      });
      var colorInputView = new ColorInputView({
        model: model,
        propertyName: 'color',
        defaultValueBinding: 'light',
        defaultValue: function(light) { return light ? '#fefefe' : '#010101'; }
      });

      var colorInputViewDomino = support.dom.ColorInputView.render(
        colorInputView
      );

      expect(colorInputViewDomino.value()).toBe('#fefefe');
    });

    test(
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

        var colorInputViewDomino = support.dom.ColorInputView.render(
          colorInputView
        );
        model.set('light', false);

        expect(colorInputViewDomino.value()).toBe('#010101');
      }
    );

    test('does not store default value in model', () => {
      var model = new Backbone.Model({
        light: true
      });
      var colorInputView = new ColorInputView({
        model: model,
        propertyName: 'color',
        defaultValueBinding: 'light',
        defaultValue: function(light) { return light ? '#fefefe' : '#010101'; }
      });

      var colorInputViewDomino = support.dom.ColorInputView.render(
        colorInputView,
        {appendTo: testContext.htmlSandbox}
      );
      model.set('light', false);
      colorInputViewDomino.fillIn('#010101', testContext.clock);

      expect(model.has('color')).toBe(false);
    });

    test('stores non default value in model', () => {
      var model = new Backbone.Model({
        light: true
      });
      var colorInputView = new ColorInputView({
        model: model,
        propertyName: 'color',
        defaultValueBinding: 'light',
        defaultValue: function(light) { return light ? '#fefefe' : '#010101'; }
      });

      var colorInputViewDomino = support.dom.ColorInputView.render(
        colorInputView,
        {appendTo: testContext.htmlSandbox}
      );
      model.set('light', false);
      colorInputViewDomino.fillIn('#fefefe', testContext.clock);

      expect(model.get('color')).toBe('#fefefe');
    });

    test('unsets attribute in model if choosing default value', () => {
      var model = new Backbone.Model({
        light: true
      });
      var colorInputView = new ColorInputView({
        model: model,
        propertyName: 'color',
        defaultValueBinding: 'light',
        defaultValue: function(light) { return light ? '#fefefe' : '#010101'; }
      });

      var colorInputViewDomino = support.dom.ColorInputView.render(
        colorInputView,
        {appendTo: testContext.htmlSandbox}
      );
      model.set('light', false);
      colorInputViewDomino.fillIn('#010101', testContext.clock);

      expect(model.has('color')).toBe(false);
    });
  });
});