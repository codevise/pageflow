import {
  ColorSelectOrCustomColorInputView
} from 'editor/views/inputs/ColorSelectOrCustomColorInputView';
import Backbone from 'backbone';

import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';
import {useFakeTranslations} from 'pageflow/testHelpers';
import {renderReactBasedBackboneView as render} from 'pageflow-scrolled/testHelpers';
import 'support/toBeVisibleViaBinding';

describe('ColorSelectOrCustomColorInputView', () => {
  useFakeTranslations({
    'pageflow_scrolled.editor.blank': 'Auto',
    'pageflow_scrolled.editor.custom_color': 'Custom Color'
  });

  it('loads theme palette color value', async () => {
    const model = new Backbone.Model({
      color: 'brand-red'
    });

    const inputView = new ColorSelectOrCustomColorInputView({
      model,
      label: 'Background Color',
      customColorTranslationKey: 'pageflow_scrolled.editor.custom_color',
      values: ['brand-red', 'brand-green'],
      texts: ['Red', 'Green'],
      propertyName: 'color'
    });

    const {getByRole, queryByRole} = render(inputView);

    expect(getByRole('button', {name: 'Red'})).not.toBeNull();
    expect(queryByRole('textbox')).toBeNull();
  });

  it('loads custom color value', async () => {
    const model = new Backbone.Model({
      color: '#ff0000'
    });

    const inputView = new ColorSelectOrCustomColorInputView({
      model,
      label: 'Background Color',
      customColorTranslationKey: 'pageflow_scrolled.editor.custom_color',
      values: ['brand-red', 'brand-green'],
      texts: ['Red', 'Green'],
      propertyName: 'color'
    });

    const {getByRole} = render(inputView);

    expect(getByRole('button', {name: 'Custom Color'})).not.toBeNull();
    expect(getByRole('textbox')).not.toBeNull();
    expect(getByRole('textbox')).toHaveValue('#ff0000');
  });

  it('updates model when selecting theme palette color', async () => {
    const model = new Backbone.Model({
      color: '#ff0000'
    });

    const inputView = new ColorSelectOrCustomColorInputView({
      model,
      label: 'Background Color',
      customColorTranslationKey: 'pageflow_scrolled.editor.custom_color',
      values: ['brand-red', 'brand-green'],
      texts: ['Red', 'Green'],
      propertyName: 'color'
    });

    const user = userEvent.setup();
    const {getByRole} = render(inputView);
    await user.click(getByRole('button', {name: 'Custom Color'}));
    await user.click(getByRole('option', {name: 'Red'}));

    expect(model.get('color')).toBe('brand-red');
  });

  it('updates model when selecting custom color', async () => {
    const model = new Backbone.Model({
      color: 'brand-red'
    });

    const inputView = new ColorSelectOrCustomColorInputView({
      model,
      label: 'Background Color',
      customColorTranslationKey: 'pageflow_scrolled.editor.custom_color',
      values: ['brand-red', 'brand-green'],
      texts: ['Red', 'Green'],
      propertyName: 'color'
    });

    const user = userEvent.setup();
    const {getByRole} = render(inputView);
    await user.click(getByRole('button', {name: 'Red'}));
    await user.click(getByRole('option', {name: 'Custom Color'}));

    const input = getByRole('textbox');
    await user.clear(input);
    await user.type(input, '#ff0000');
    await new Promise(resolve => setTimeout(resolve, 300));

    expect(model.get('color')).toBe('#ff0000');
  });

  it('shows custom color input only when custom is selected', async () => {
    const model = new Backbone.Model({
      color: 'brand-red'
    });

    const inputView = new ColorSelectOrCustomColorInputView({
      model,
      label: 'Background Color',
      customColorTranslationKey: 'pageflow_scrolled.editor.custom_color',
      values: ['brand-red', 'brand-green'],
      texts: ['Red', 'Green'],
      propertyName: 'color'
    });

    const user = userEvent.setup();
    const {getByRole, queryByRole} = render(inputView);

    expect(queryByRole('textbox')).toBeNull();

    await user.click(getByRole('button', {name: 'Red'}));
    await user.click(getByRole('option', {name: 'Custom Color'}));

    expect(getByRole('textbox')).not.toBeNull();

    await user.click(getByRole('button', {name: 'Custom Color'}));
    await user.click(getByRole('option', {name: 'Red'}));

    expect(queryByRole('textbox')).toBeNull();
  });

  it('uses provided translations', async () => {
    const model = new Backbone.Model();

    const inputView = new ColorSelectOrCustomColorInputView({
      model,
      label: 'Background Color',
      includeBlank: true,
      blankTranslationKey: 'pageflow_scrolled.editor.blank',
      customColorTranslationKey: 'pageflow_scrolled.editor.custom_color',
      values: ['brand-red', 'brand-green'],
      texts: ['Red', 'Green'],
      propertyName: 'color'
    });

    const {getByText, getByRole} = render(inputView);

    expect(getByText('Background Color')).not.toBeNull();

    // Click the button to open the dropdown
    await userEvent.click(getByRole('button'));

    expect(getByRole('option', {name: 'Auto'})).not.toBeNull();
  });

  describe('visibleBinding', () => {
    it('hides select input based on visibleBinding', () => {
      const model = new Backbone.Model({
        color: 'brand-red',
        hidden: true
      });

      const inputView = new ColorSelectOrCustomColorInputView({
        model,
        label: 'Background Color',
        customColorTranslationKey: 'pageflow_scrolled.editor.custom_color',
        values: ['brand-red', 'brand-green'],
        texts: ['Red', 'Green'],
        propertyName: 'color',
        visibleBinding: 'hidden',
        visibleBindingValue: false
      });

      const {getByRole} = render(inputView);

      expect(getByRole('button', {name: 'Red'})).not.toBeVisibleViaBinding();
    });

    it('shows select input when visibleBinding condition is met', () => {
      const model = new Backbone.Model({
        color: 'brand-red',
        hidden: false
      });

      const inputView = new ColorSelectOrCustomColorInputView({
        model,
        label: 'Background Color',
        customColorTranslationKey: 'pageflow_scrolled.editor.custom_color',
        values: ['brand-red', 'brand-green'],
        texts: ['Red', 'Green'],
        propertyName: 'color',
        visibleBinding: 'hidden',
        visibleBindingValue: false
      });

      const {getByRole} = render(inputView);

      expect(getByRole('button', {name: 'Red'})).toBeVisibleViaBinding();
    });

    it('hides custom color input based on visibleBinding', () => {
      const model = new Backbone.Model({
        color: '#ff0000',
        hidden: true
      });

      const inputView = new ColorSelectOrCustomColorInputView({
        model,
        label: 'Background Color',
        customColorTranslationKey: 'pageflow_scrolled.editor.custom_color',
        values: ['brand-red', 'brand-green'],
        texts: ['Red', 'Green'],
        propertyName: 'color',
        visibleBinding: 'hidden',
        visibleBindingValue: false
      });

      const {getByRole} = render(inputView);

      expect(getByRole('textbox')).not.toBeVisibleViaBinding();
    });

    it('shows custom color input when visibleBinding condition is met', () => {
      const model = new Backbone.Model({
        color: '#ff0000',
        hidden: false
      });

      const inputView = new ColorSelectOrCustomColorInputView({
        model,
        label: 'Background Color',
        customColorTranslationKey: 'pageflow_scrolled.editor.custom_color',
        values: ['brand-red', 'brand-green'],
        texts: ['Red', 'Green'],
        propertyName: 'color',
        visibleBinding: 'hidden',
        visibleBindingValue: false
      });

      const {getByRole} = render(inputView);

      expect(getByRole('textbox')).toBeVisibleViaBinding();
    });

    it('uses custom visibleBindingModel for select input', () => {
      const model = new Backbone.Model({
        color: 'brand-red'
      });
      const bindingModel = new Backbone.Model({
        hidden: true
      });

      const inputView = new ColorSelectOrCustomColorInputView({
        model,
        label: 'Background Color',
        customColorTranslationKey: 'pageflow_scrolled.editor.custom_color',
        values: ['brand-red', 'brand-green'],
        texts: ['Red', 'Green'],
        propertyName: 'color',
        visibleBinding: 'hidden',
        visibleBindingValue: false,
        visibleBindingModel: bindingModel
      });

      const {getByRole} = render(inputView);

      expect(getByRole('button', {name: 'Red'})).not.toBeVisibleViaBinding();
    });

    it('uses custom visibleBindingModel for custom color input', () => {
      const model = new Backbone.Model({
        color: '#ff0000'
      });
      const bindingModel = new Backbone.Model({
        hidden: true
      });

      const inputView = new ColorSelectOrCustomColorInputView({
        model,
        label: 'Background Color',
        customColorTranslationKey: 'pageflow_scrolled.editor.custom_color',
        values: ['brand-red', 'brand-green'],
        texts: ['Red', 'Green'],
        propertyName: 'color',
        visibleBinding: 'hidden',
        visibleBindingValue: false,
        visibleBindingModel: bindingModel
      });

      const {getByRole} = render(inputView);

      expect(getByRole('textbox')).not.toBeVisibleViaBinding();
    });

    it('supports visible function without visibleBinding', () => {
      const model = new Backbone.Model({
        color: 'brand-red'
      });

      const inputView = new ColorSelectOrCustomColorInputView({
        model,
        label: 'Background Color',
        customColorTranslationKey: 'pageflow_scrolled.editor.custom_color',
        values: ['brand-red', 'brand-green'],
        texts: ['Red', 'Green'],
        propertyName: 'color',
        visible: () => false
      });

      const {getByRole} = render(inputView);

      expect(getByRole('button', {name: 'Red'})).not.toBeVisibleViaBinding();
    });

    it('supports visible function for custom color input', () => {
      const model = new Backbone.Model({
        color: '#ff0000'
      });

      const inputView = new ColorSelectOrCustomColorInputView({
        model,
        label: 'Background Color',
        customColorTranslationKey: 'pageflow_scrolled.editor.custom_color',
        values: ['brand-red', 'brand-green'],
        texts: ['Red', 'Green'],
        propertyName: 'color',
        visible: () => false
      });

      const {getByRole} = render(inputView);

      expect(getByRole('textbox')).not.toBeVisibleViaBinding();
    });

    it('supports visibleBinding with visible function instead of visibleBindingValue', () => {
      const model = new Backbone.Model({
        color: 'brand-red',
        state: 'locked'
      });

      const inputView = new ColorSelectOrCustomColorInputView({
        model,
        label: 'Background Color',
        customColorTranslationKey: 'pageflow_scrolled.editor.custom_color',
        values: ['brand-red', 'brand-green'],
        texts: ['Red', 'Green'],
        propertyName: 'color',
        visibleBinding: 'state',
        visible: state => state !== 'locked'
      });

      const {getByRole} = render(inputView);

      expect(getByRole('button', {name: 'Red'})).not.toBeVisibleViaBinding();
    });
  });

  describe('disabledBinding', () => {
    it('disables select input based on disabledBinding', () => {
      const model = new Backbone.Model({
        color: 'brand-red',
        locked: true
      });

      const inputView = new ColorSelectOrCustomColorInputView({
        model,
        label: 'Background Color',
        customColorTranslationKey: 'pageflow_scrolled.editor.custom_color',
        values: ['brand-red', 'brand-green'],
        texts: ['Red', 'Green'],
        propertyName: 'color',
        disabledBinding: 'locked',
        disabledBindingValue: true
      });

      const {getByRole} = render(inputView);

      expect(getByRole('button', {name: 'Red'}).closest('.input')).toHaveClass('input-disabled');
    });

    it('enables select input when disabledBinding condition is not met', () => {
      const model = new Backbone.Model({
        color: 'brand-red',
        locked: false
      });

      const inputView = new ColorSelectOrCustomColorInputView({
        model,
        label: 'Background Color',
        customColorTranslationKey: 'pageflow_scrolled.editor.custom_color',
        values: ['brand-red', 'brand-green'],
        texts: ['Red', 'Green'],
        propertyName: 'color',
        disabledBinding: 'locked',
        disabledBindingValue: true
      });

      const {getByRole} = render(inputView);

      expect(getByRole('button', {name: 'Red'}).closest('.input')).not.toHaveClass('input-disabled');
    });

    it('disables custom color input based on disabledBinding', () => {
      const model = new Backbone.Model({
        color: '#ff0000',
        locked: true
      });

      const inputView = new ColorSelectOrCustomColorInputView({
        model,
        label: 'Background Color',
        customColorTranslationKey: 'pageflow_scrolled.editor.custom_color',
        values: ['brand-red', 'brand-green'],
        texts: ['Red', 'Green'],
        propertyName: 'color',
        disabledBinding: 'locked',
        disabledBindingValue: true
      });

      const {getByRole} = render(inputView);

      expect(getByRole('textbox').closest('.input')).toHaveClass('input-disabled');
    });

    it('enables custom color input when disabledBinding condition is not met', () => {
      const model = new Backbone.Model({
        color: '#ff0000',
        locked: false
      });

      const inputView = new ColorSelectOrCustomColorInputView({
        model,
        label: 'Background Color',
        customColorTranslationKey: 'pageflow_scrolled.editor.custom_color',
        values: ['brand-red', 'brand-green'],
        texts: ['Red', 'Green'],
        propertyName: 'color',
        disabledBinding: 'locked',
        disabledBindingValue: true
      });

      const {getByRole} = render(inputView);

      expect(getByRole('textbox').closest('.input')).not.toHaveClass('input-disabled');
    });

    it('uses custom disabledBindingModel for select input', () => {
      const model = new Backbone.Model({
        color: 'brand-red'
      });
      const bindingModel = new Backbone.Model({
        locked: true
      });

      const inputView = new ColorSelectOrCustomColorInputView({
        model,
        label: 'Background Color',
        customColorTranslationKey: 'pageflow_scrolled.editor.custom_color',
        values: ['brand-red', 'brand-green'],
        texts: ['Red', 'Green'],
        propertyName: 'color',
        disabledBinding: 'locked',
        disabledBindingValue: true,
        disabledBindingModel: bindingModel
      });

      const {getByRole} = render(inputView);

      expect(getByRole('button', {name: 'Red'}).closest('.input')).toHaveClass('input-disabled');
    });

    it('uses custom disabledBindingModel for custom color input', () => {
      const model = new Backbone.Model({
        color: '#ff0000'
      });
      const bindingModel = new Backbone.Model({
        locked: true
      });

      const inputView = new ColorSelectOrCustomColorInputView({
        model,
        label: 'Background Color',
        customColorTranslationKey: 'pageflow_scrolled.editor.custom_color',
        values: ['brand-red', 'brand-green'],
        texts: ['Red', 'Green'],
        propertyName: 'color',
        disabledBinding: 'locked',
        disabledBindingValue: true,
        disabledBindingModel: bindingModel
      });

      const {getByRole} = render(inputView);

      expect(getByRole('textbox').closest('.input')).toHaveClass('input-disabled');
    });

    it('supports disabled function without disabledBinding', () => {
      const model = new Backbone.Model({
        color: 'brand-red'
      });

      const inputView = new ColorSelectOrCustomColorInputView({
        model,
        label: 'Background Color',
        customColorTranslationKey: 'pageflow_scrolled.editor.custom_color',
        values: ['brand-red', 'brand-green'],
        texts: ['Red', 'Green'],
        propertyName: 'color',
        disabled: () => true
      });

      const {getByRole} = render(inputView);

      expect(getByRole('button', {name: 'Red'}).closest('.input')).toHaveClass('input-disabled');
    });

    it('supports disabled function for custom color input', () => {
      const model = new Backbone.Model({
        color: '#ff0000'
      });

      const inputView = new ColorSelectOrCustomColorInputView({
        model,
        label: 'Background Color',
        customColorTranslationKey: 'pageflow_scrolled.editor.custom_color',
        values: ['brand-red', 'brand-green'],
        texts: ['Red', 'Green'],
        propertyName: 'color',
        disabled: () => true
      });

      const {getByRole} = render(inputView);

      expect(getByRole('textbox').closest('.input')).toHaveClass('input-disabled');
    });

    it('supports disabledBinding with disabled function instead of disabledBindingValue', () => {
      const model = new Backbone.Model({
        color: 'brand-red',
        state: 'locked'
      });

      const inputView = new ColorSelectOrCustomColorInputView({
        model,
        label: 'Background Color',
        customColorTranslationKey: 'pageflow_scrolled.editor.custom_color',
        values: ['brand-red', 'brand-green'],
        texts: ['Red', 'Green'],
        propertyName: 'color',
        disabledBinding: 'state',
        disabled: state => state === 'locked'
      });

      const {getByRole} = render(inputView);

      expect(getByRole('button', {name: 'Red'}).closest('.input')).toHaveClass('input-disabled');
    });
  });
});
