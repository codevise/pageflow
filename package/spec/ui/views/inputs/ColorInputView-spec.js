import Backbone from 'backbone';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';

import {ColorInputView} from 'pageflow/ui';
import {renderBackboneView} from 'testHelpers/renderBackboneView';

describe('pageflow.ColorInputView', () => {
  const user = userEvent.setup({delay: null});

  function render(options) {
    return renderBackboneView(new ColorInputView({
      disableChangeDebounce: true,
      ...options
    }));
  }

  async function fillIn(input, value) {
    await user.clear(input);
    await user.type(input, value);
  }

  it('loads value into input', () => {
    const {getByRole} = render({
      model: new Backbone.Model({color: '#ababab'}),
      propertyName: 'color'
    });

    expect(getByRole('textbox')).toHaveValue('#ababab');
  });

  it('updates input when model changes', () => {
    const model = new Backbone.Model();
    const {getByRole} = render({model, propertyName: 'color'});

    model.set('color', '#ababab');

    expect(getByRole('textbox')).toHaveValue('#ababab');
  });

  it('saves value to model on change', async () => {
    const model = new Backbone.Model({color: '#ababab'});
    const {getByRole} = render({model, propertyName: 'color'});

    await fillIn(getByRole('textbox'), '#bbb');

    expect(model.get('color')).toBe('#bbbbbb');
  });

  it('does not update color input with normalized value', async () => {
    const model = new Backbone.Model({color: '#ababab'});
    const {getByRole} = render({model, propertyName: 'color'});

    await fillIn(getByRole('textbox'), '#bbb');

    expect(getByRole('textbox')).toHaveValue('#bbb');
  });

  it('allows passing swatches', () => {
    const {getAllByRole} = render({
      model: new Backbone.Model(),
      propertyName: 'color',
      swatches: ['#cdcdcd', '#dedede']
    });

    const buttons = getAllByRole('button');
    expect(buttons).toHaveLength(2);
    expect(buttons[0]).toHaveTextContent('#cdcdcd');
    expect(buttons[1]).toHaveTextContent('#dedede');
  });

  describe('with defaultValue option', () => {
    it('falls back to default value', () => {
      const {getByRole} = render({
        model: new Backbone.Model(),
        propertyName: 'color',
        defaultValue: '#cdcdcd'
      });

      expect(getByRole('textbox')).toHaveValue('#cdcdcd');
    });

    it('does not store default value in model', async () => {
      const model = new Backbone.Model();
      const {getByRole} = render({model, propertyName: 'color', defaultValue: '#cdcdcd'});

      await fillIn(getByRole('textbox'), '#cdcdcd');

      expect(model.has('color')).toBe(false);
    });

    it('stores non default value in model', async () => {
      const model = new Backbone.Model();
      const {getByRole} = render({model, propertyName: 'color', defaultValue: '#cdcdcd'});

      await fillIn(getByRole('textbox'), '#ababab');

      expect(model.get('color')).toBe('#ababab');
    });

    it('unsets attribute in model if choosing default value', async () => {
      const model = new Backbone.Model({color: '#fff'});
      const {getByRole} = render({model, propertyName: 'color', defaultValue: '#cdcdcd'});

      await fillIn(getByRole('textbox'), '#cdcdcd');

      expect(model.has('color')).toBe(false);
    });

    it('includes swatch for default value', () => {
      const {getAllByRole} = render({
        model: new Backbone.Model(),
        propertyName: 'color',
        defaultValue: '#cdcdcd',
        swatches: ['#dedede']
      });

      const buttons = getAllByRole('button');
      expect(buttons).toHaveLength(2);
      expect(buttons[0]).toHaveTextContent('#cdcdcd');
      expect(buttons[1]).toHaveTextContent('#dedede');
    });

    it('does not duplicate swatch', () => {
      const {getAllByRole} = render({
        model: new Backbone.Model(),
        propertyName: 'color',
        defaultValue: '#cdcdcd',
        swatches: ['#dedede', '#cdcdcd']
      });

      expect(getAllByRole('button')).toHaveLength(2);
    });
  });

  describe('with function as defaultValue option', () => {
    it('falls back to default value', () => {
      const {getByRole} = render({
        model: new Backbone.Model(),
        propertyName: 'color',
        defaultValue: () => '#cdcdcd'
      });

      expect(getByRole('textbox')).toHaveValue('#cdcdcd');
    });

    it('does not store default value in model', async () => {
      const model = new Backbone.Model();
      const {getByRole} = render({
        model, propertyName: 'color',
        defaultValue: () => '#cdcdcd'
      });

      await fillIn(getByRole('textbox'), '#cdcdcd');

      expect(model.has('color')).toBe(false);
    });

    it('stores non default value in model', async () => {
      const model = new Backbone.Model();
      const {getByRole} = render({
        model, propertyName: 'color',
        defaultValue: () => '#cdcdcd'
      });

      await fillIn(getByRole('textbox'), '#ababab');

      expect(model.get('color')).toBe('#ababab');
    });

    it('unsets attribute in model if choosing default value', async () => {
      const model = new Backbone.Model({color: '#fff'});
      const {getByRole} = render({
        model, propertyName: 'color',
        defaultValue: () => '#cdcdcd'
      });

      await fillIn(getByRole('textbox'), '#cdcdcd');

      expect(model.has('color')).toBe(false);
    });

    it('includes swatch for default value', () => {
      const {getAllByRole} = render({
        model: new Backbone.Model(),
        propertyName: 'color',
        defaultValue: () => '#cdcdcd',
        swatches: ['#dedede']
      });

      const buttons = getAllByRole('button');
      expect(buttons).toHaveLength(2);
      expect(buttons[0]).toHaveTextContent('#cdcdcd');
    });
  });

  describe('with defaultValueBinding option', () => {
    it('uses value of binding attribute as default value', () => {
      const {getByRole} = render({
        model: new Backbone.Model({default_color: '#cdcdcd'}),
        propertyName: 'color',
        defaultValueBinding: 'default_color'
      });

      expect(getByRole('textbox')).toHaveValue('#cdcdcd');
    });

    it('updates displayed default value when binding attribute changes', () => {
      const model = new Backbone.Model({default_color: '#aaaaaa'});
      const {getByRole} = render({model, propertyName: 'color', defaultValueBinding: 'default_color'});

      model.set('default_color', '#cdcdcd');

      expect(getByRole('textbox')).toHaveValue('#cdcdcd');
    });

    it('does not store default value in model', async () => {
      const model = new Backbone.Model({default_color: '#cdcdcd'});
      const {getByRole} = render({model, propertyName: 'color', defaultValueBinding: 'default_color'});

      model.set('default_color', '#aaaaaa');
      await fillIn(getByRole('textbox'), '#aaaaaa');

      expect(model.has('color')).toBe(false);
    });

    it('stores non default value in model', async () => {
      const model = new Backbone.Model({default_color: '#cdcdcd'});
      const {getByRole} = render({model, propertyName: 'color', defaultValueBinding: 'default_color'});

      model.set('default_color', '#aaaaaa');
      await fillIn(getByRole('textbox'), '#cdcdcd');

      expect(model.get('color')).toBe('#cdcdcd');
    });

    it('unsets attribute in model if choosing default value', async () => {
      const model = new Backbone.Model({color: '#fff'});
      const {getByRole} = render({model, propertyName: 'color', defaultValueBinding: 'default_color'});

      model.set('default_color', '#cdcdcd');
      await fillIn(getByRole('textbox'), '#cdcdcd');

      expect(model.has('color')).toBe(false);
    });
  });

  describe('with function as defaultValue and defaultValueBinding option', () => {
    it('passes binding attribute to default value function', () => {
      const {getByRole} = render({
        model: new Backbone.Model({light: true}),
        propertyName: 'color',
        defaultValueBinding: 'light',
        defaultValue: light => light ? '#fefefe' : '#010101'
      });

      expect(getByRole('textbox')).toHaveValue('#fefefe');
    });

    it('updates displayed default value when binding attribute changes', () => {
      const model = new Backbone.Model({light: true});
      const {getByRole} = render({
        model, propertyName: 'color',
        defaultValueBinding: 'light',
        defaultValue: light => light ? '#fefefe' : '#010101'
      });

      model.set('light', false);

      expect(getByRole('textbox')).toHaveValue('#010101');
    });

    it('does not store default value in model', async () => {
      const model = new Backbone.Model({light: true});
      const {getByRole} = render({
        model, propertyName: 'color',
        defaultValueBinding: 'light',
        defaultValue: light => light ? '#fefefe' : '#010101'
      });

      model.set('light', false);
      await fillIn(getByRole('textbox'), '#010101');

      expect(model.has('color')).toBe(false);
    });

    it('stores non default value in model', async () => {
      const model = new Backbone.Model({light: true});
      const {getByRole} = render({
        model, propertyName: 'color',
        defaultValueBinding: 'light',
        defaultValue: light => light ? '#fefefe' : '#010101'
      });

      model.set('light', false);
      await fillIn(getByRole('textbox'), '#fefefe');

      expect(model.get('color')).toBe('#fefefe');
    });

    it('unsets attribute in model if choosing default value', async () => {
      const model = new Backbone.Model({light: true});
      const {getByRole} = render({
        model, propertyName: 'color',
        defaultValueBinding: 'light',
        defaultValue: light => light ? '#fefefe' : '#010101'
      });

      model.set('light', false);
      await fillIn(getByRole('textbox'), '#010101');

      expect(model.has('color')).toBe(false);
    });
  });

  it('removes picker element when view is closed', () => {
    const pickersBefore = document.querySelectorAll('.color_picker').length;
    const view = new ColorInputView({
      model: new Backbone.Model(),
      propertyName: 'color'
    });

    renderBackboneView(view);

    expect(document.querySelectorAll('.color_picker').length).toBe(pickersBefore + 1);

    view.close();

    expect(document.querySelectorAll('.color_picker').length).toBe(pickersBefore);
  });

  describe('with placeholderColor option', () => {
    it('sets fallback color', () => {
      const {getByRole} = render({
        model: new Backbone.Model(),
        propertyName: 'color',
        placeholderColor: '#ff0000',
        placeholderColorDescription: 'Automatic color'
      });

      expect(getByRole('textbox'))
        .toHaveAccessibleDescription('Automatic color: #ff0000');
    });
  });

  describe('with placeholderColor and placeholderColorBinding option', () => {
    it('sets fallback color', () => {
      const {getByRole} = render({
        model: new Backbone.Model(),
        propertyName: 'color',
        placeholderColorBinding: 'invert',
        placeholderColor: invert => invert ? '#000000' : '#ffffff',
        placeholderColorDescription: 'Automatic color'
      });

      expect(getByRole('textbox'))
        .toHaveAccessibleDescription('Automatic color: #ffffff');
    });

    it('updates fallback color', () => {
      const model = new Backbone.Model();
      const {getByRole} = render({
        model,
        propertyName: 'color',
        placeholderColorBinding: 'invert',
        placeholderColor: invert => invert ? '#000000' : '#ffffff',
        placeholderColorDescription: 'Automatic color'
      });

      model.set('invert', true);

      expect(getByRole('textbox'))
        .toHaveAccessibleDescription('Automatic color: #000000');
    });
  });
});
