import {StyleListInputView} from 'editor/views/inputs/StyleListInputView';

import Backbone from 'backbone';

import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';
import {renderBackboneView as render, useFakeTranslations} from 'pageflow/testHelpers';

import styles from 'editor/views/inputs/StyleListInputView.module.css';

describe('StyleListInputView', () => {
  useFakeTranslations({
    'pageflow_scrolled.editor.style_list_input.add': 'Add style',
    'pageflow_scrolled.editor.style_list_input.remove': 'Remove style',
    'pageflow.ui.color_picker.hue': 'Hue',
    'pageflow.ui.color_picker.opacity': 'Opacity'
  });

  it('displays styles', () => {
    const types = {
      blur: {
        label: 'Blur',
        minValue: 0,
        maxValue: 100,
        defaultValue: 50,
        kind: 'filter',
        inputType: 'slider'
      }
    };
    const model = new Backbone.Model({styles: [
      {name: 'blur', value: 30}
    ]});

    const view = new StyleListInputView({
      model,
      propertyName: 'styles',
      types,
      translationKeyPrefix: 'pageflow_scrolled.editor.style_list_input'
    });
    view.render();

    expect(view.el).toHaveTextContent('Blur 30');
  });

  it('allows adding styles', async () => {
    const types = {
      blur: {
        label: 'Blur',
        minValue: 0,
        maxValue: 100,
        defaultValue: 50,
        kind: 'filter',
        inputType: 'slider'
      }
    };
    const model = new Backbone.Model();

    const view = new StyleListInputView({
      model,
      propertyName: 'styles',
      types,
      translationKeyPrefix: 'pageflow_scrolled.editor.style_list_input'
    });

    const user = userEvent.setup();
    const {getByRole} = render(view);
    await user.click(getByRole('button', {name: 'Add style'}));
    await user.click(getByRole('link', {name: 'Blur'}));

    expect(model.get('styles')).toEqual([{name: 'blur', value: 50}])
  });

  it('does not apply negative margin top by default', () => {
    const types = {};
    const model = new Backbone.Model();

    const view = new StyleListInputView({
      model,
      propertyName: 'styles',
      types,
      translationKeyPrefix: 'pageflow_scrolled.editor.style_list_input'
    });
    render(view);

    expect(view.el).not.toHaveClass(styles.negativeMarginTop);
  });

  it('applies negative margin top when hideLabel is set', () => {
    const types = {};
    const model = new Backbone.Model();

    const view = new StyleListInputView({
      model,
      propertyName: 'styles',
      types,
      hideLabel: true,
      translationKeyPrefix: 'pageflow_scrolled.editor.style_list_input'
    });
    render(view);

    expect(view.el).toHaveClass(styles.negativeMarginTop);
  });

  it('displays text for slider with discrete values', () => {
    const types = {
      margin: {
        label: 'Margin',
        inputType: 'slider',
        values: ['sm', 'md', 'lg'],
        texts: ['Small', 'Medium', 'Large'],
        defaultValue: 'sm'
      }
    };
    const model = new Backbone.Model({styles: [
      {name: 'margin', value: 'md'}
    ]});

    const view = new StyleListInputView({
      model,
      propertyName: 'styles',
      types,
      translationKeyPrefix: 'pageflow_scrolled.editor.style_list_input'
    });
    view.render();

    expect(view.el).toHaveTextContent('Margin Medium');
  });

  it('displays default text when style with discrete values uses default', () => {
    const types = {
      margin: {
        label: 'Margin',
        inputType: 'slider',
        values: ['sm', 'md', 'lg'],
        texts: ['Small', 'Medium', 'Large'],
        defaultValue: 'sm'
      }
    };
    const model = new Backbone.Model({styles: [
      {name: 'margin'}
    ]});

    const view = new StyleListInputView({
      model,
      propertyName: 'styles',
      types,
      translationKeyPrefix: 'pageflow_scrolled.editor.style_list_input'
    });
    view.render();

    expect(view.el).toHaveTextContent('Margin Small');
  });

  it('stores default value when adding style with discrete values', async () => {
    const types = {
      margin: {
        label: 'Margin',
        inputType: 'slider',
        values: ['sm', 'md', 'lg'],
        texts: ['Small', 'Medium', 'Large'],
        defaultValue: 'sm'
      }
    };
    const model = new Backbone.Model();

    const view = new StyleListInputView({
      model,
      propertyName: 'styles',
      types,
      translationKeyPrefix: 'pageflow_scrolled.editor.style_list_input'
    });

    const user = userEvent.setup();
    const {getByRole} = render(view);
    await user.click(getByRole('button', {name: 'Add style'}));
    await user.click(getByRole('link', {name: 'Margin'}));

    expect(model.get('styles')).toEqual([{name: 'margin', value: 'sm'}]);
  });

  it('saves on slide when using discrete values', () => {
    const types = {
      margin: {
        label: 'Margin',
        inputType: 'slider',
        values: ['sm', 'md', 'lg'],
        texts: ['Small', 'Medium', 'Large'],
        defaultValue: 'sm'
      }
    };
    const model = new Backbone.Model({styles: [
      {name: 'margin', value: 'sm'}
    ]});

    const view = new StyleListInputView({
      model,
      propertyName: 'styles',
      types,
      translationKeyPrefix: 'pageflow_scrolled.editor.style_list_input'
    });
    view.render();

    view.$el.find('.ui-slider').trigger('slide', {value: 2});

    expect(model.get('styles')).toEqual([{name: 'margin', value: 'lg'}]);
  });

  it('does not save on slide for continuous slider', () => {
    const types = {
      blur: {
        label: 'Blur',
        minValue: 0,
        maxValue: 100,
        defaultValue: 50,
        kind: 'filter',
        inputType: 'slider'
      }
    };
    const model = new Backbone.Model({styles: [
      {name: 'blur', value: 30}
    ]});

    const view = new StyleListInputView({
      model,
      propertyName: 'styles',
      types,
      translationKeyPrefix: 'pageflow_scrolled.editor.style_list_input'
    });
    view.render();

    view.$el.find('.ui-slider').trigger('slide', {value: 80});

    expect(model.get('styles')).toEqual([{name: 'blur', value: 30}]);
  });

  it('ignores model property value not included in discrete values', () => {
    const types = {
      marginTop: {
        label: 'Margin top',
        inputType: 'slider',
        propertyName: 'marginTop',
        values: ['sm', 'md', 'lg'],
        texts: ['Small', 'Medium', 'Large'],
        defaultValue: 'sm'
      }
    };
    const model = new Backbone.Model({marginTop: 'none'});

    const view = new StyleListInputView({
      model,
      propertyName: 'styles',
      types,
      translationKeyPrefix: 'pageflow_scrolled.editor.style_list_input'
    });

    const {queryByRole} = render(view);

    expect(queryByRole('button', {name: 'Remove style'})).toBeNull();
  });

  it('reads initial value from model property for style type with propertyName', () => {
    const types = {
      marginTop: {
        label: 'Margin top',
        inputType: 'slider',
        propertyName: 'marginTop',
        values: ['sm', 'md', 'lg'],
        texts: ['Small', 'Medium', 'Large'],
        defaultValue: 'sm'
      }
    };
    const model = new Backbone.Model({marginTop: 'md'});

    const view = new StyleListInputView({
      model,
      propertyName: 'styles',
      types,
      translationKeyPrefix: 'pageflow_scrolled.editor.style_list_input'
    });
    view.render();

    expect(view.el).toHaveTextContent('Margin top Medium');
  });

  it('sets value on model property when adding style with propertyName', async () => {
    const types = {
      marginTop: {
        label: 'Margin top',
        inputType: 'slider',
        propertyName: 'marginTop',
        values: ['sm', 'md', 'lg'],
        texts: ['Small', 'Medium', 'Large'],
        defaultValue: 'sm'
      }
    };
    const model = new Backbone.Model();

    const view = new StyleListInputView({
      model,
      propertyName: 'styles',
      types,
      translationKeyPrefix: 'pageflow_scrolled.editor.style_list_input'
    });

    const user = userEvent.setup();
    const {getByRole} = render(view);
    await user.click(getByRole('button', {name: 'Add style'}));
    await user.click(getByRole('link', {name: 'Margin top'}));

    expect(model.get('marginTop')).toEqual('sm');
    expect(model.get('styles')).toEqual([]);
  });

  it('sets model property to resetValue when removing style with resetValue', async () => {
    const types = {
      marginTop: {
        label: 'Margin top',
        inputType: 'slider',
        propertyName: 'marginTop',
        resetValue: 'none',
        values: ['none', 'sm', 'md', 'lg'],
        texts: ['None', 'Small', 'Medium', 'Large'],
        defaultValue: 'sm'
      }
    };
    const model = new Backbone.Model({marginTop: 'md'});

    const view = new StyleListInputView({
      model,
      propertyName: 'styles',
      types,
      translationKeyPrefix: 'pageflow_scrolled.editor.style_list_input'
    });

    const user = userEvent.setup();
    const {getByRole} = render(view);
    await user.click(getByRole('button', {name: 'Remove style'}));

    expect(model.get('marginTop')).toEqual('none');
  });

  it('unsets model property when removing style with propertyName', async () => {
    const types = {
      marginTop: {
        label: 'Margin top',
        inputType: 'slider',
        propertyName: 'marginTop',
        values: ['sm', 'md', 'lg'],
        texts: ['Small', 'Medium', 'Large'],
        defaultValue: 'sm'
      }
    };
    const model = new Backbone.Model({marginTop: 'md'});

    const view = new StyleListInputView({
      model,
      propertyName: 'styles',
      types,
      translationKeyPrefix: 'pageflow_scrolled.editor.style_list_input'
    });

    const user = userEvent.setup();
    const {getByRole} = render(view);
    await user.click(getByRole('button', {name: 'Remove style'}));

    expect(model.has('marginTop')).toBe(false);
  });

  it('applies allUsed class when all styles are in use', () => {
    const types = {
      blur: {
        label: 'Blur',
        minValue: 0,
        maxValue: 100,
        defaultValue: 50,
        kind: 'filter',
        inputType: 'slider'
      }
    };
    const model = new Backbone.Model({styles: [
      {name: 'blur', value: 30}
    ]});

    const view = new StyleListInputView({
      model,
      propertyName: 'styles',
      types,
      translationKeyPrefix: 'pageflow_scrolled.editor.style_list_input'
    });
    render(view);

    expect(view.el).toHaveClass(styles.allUsed);
  });

  it('removes allUsed class when style is removed', async () => {
    const types = {
      blur: {
        label: 'Blur',
        minValue: 0,
        maxValue: 100,
        defaultValue: 50,
        kind: 'filter',
        inputType: 'slider'
      }
    };
    const model = new Backbone.Model({styles: [
      {name: 'blur', value: 30}
    ]});

    const view = new StyleListInputView({
      model,
      propertyName: 'styles',
      types,
      translationKeyPrefix: 'pageflow_scrolled.editor.style_list_input'
    });

    const user = userEvent.setup();
    const {getByRole} = render(view);
    await user.click(getByRole('button', {name: 'Remove style'}));

    expect(view.el).not.toHaveClass(styles.allUsed);
  });

  it('renders hue and opacity sliders with aria-labels for color input with alpha', () => {
    const types = {
      outlineColor: {
        label: 'Outline',
        inputType: 'color',
        propertyName: 'outlineColor',
        inputOptions: {alpha: true}
      }
    };
    const model = new Backbone.Model({outlineColor: '#ff000080'});

    const view = new StyleListInputView({
      model,
      propertyName: 'styles',
      types,
      translationKeyPrefix: 'pageflow_scrolled.editor.style_list_input'
    });
    const {getByRole} = render(view);

    expect(getByRole('slider', {name: 'Hue'})).toBeDefined();
    expect(getByRole('slider', {name: 'Opacity'})).toBeDefined();
  });

  it('renders hue slider with aria-label for color input without alpha', () => {
    const types = {
      frame: {
        label: 'Frame',
        inputType: 'color',
        defaultValue: '#ffffff'
      }
    };
    const model = new Backbone.Model({styles: [
      {name: 'frame', value: '#ffffff'}
    ]});

    const view = new StyleListInputView({
      model,
      propertyName: 'styles',
      types,
      translationKeyPrefix: 'pageflow_scrolled.editor.style_list_input'
    });
    const {getByRole, queryByRole} = render(view);

    expect(getByRole('slider', {name: 'Hue'})).toBeDefined();
    expect(queryByRole('slider', {name: 'Opacity'})).toBeNull();
  });

  it('makes controls inert when binding condition becomes false', () => {
    const model = new Backbone.Model({
      posterId: 5,
      boxShadow: 'md'
    });
    const types = {
      boxShadow: {
        label: 'Box shadow',
        kind: 'decoration',
        propertyName: 'boxShadow',
        inputType: 'slider',
        values: ['sm', 'md', 'lg'],
        texts: ['Small', 'Medium', 'Large'],
        defaultValue: 'md',
        binding: 'posterId',
        when: posterId => !!posterId
      }
    };

    const view = new StyleListInputView({
      model,
      propertyName: 'styles',
      types,
      translationKeyPrefix: 'pageflow_scrolled.editor.style_list_input'
    });
    render(view);

    const controls = view.el.querySelector(`.${styles.controls}`);
    expect(controls).not.toHaveAttribute('inert');

    model.unset('posterId');

    expect(controls).toHaveAttribute('inert');
    expect(view.el.querySelector(`.${styles.item}`)).toHaveClass(styles.unavailable);
  });

  it('removes inert from controls when binding condition becomes true', () => {
    const model = new Backbone.Model({
      boxShadow: 'md'
    });
    const types = {
      boxShadow: {
        label: 'Box shadow',
        kind: 'decoration',
        propertyName: 'boxShadow',
        inputType: 'slider',
        values: ['sm', 'md', 'lg'],
        texts: ['Small', 'Medium', 'Large'],
        defaultValue: 'md',
        binding: 'posterId',
        when: posterId => !!posterId
      }
    };

    const view = new StyleListInputView({
      model,
      propertyName: 'styles',
      types,
      translationKeyPrefix: 'pageflow_scrolled.editor.style_list_input'
    });
    render(view);

    const controls = view.el.querySelector(`.${styles.controls}`);
    expect(controls).toHaveAttribute('inert');

    model.set('posterId', 5);

    expect(controls).not.toHaveAttribute('inert');
    expect(view.el.querySelector(`.${styles.item}`)).not.toHaveClass(styles.unavailable);
  });

  it('allows removing styles', async () => {
    const types = {
      blur: {
        label: 'Blur',
        minValue: 0,
        maxValue: 100,
        defaultValue: 50,
        kind: 'filter',
        inputType: 'slider'
      }
    };
    const model = new Backbone.Model({styles: [
      {name: 'blur', value: 30}
    ]});

    const view = new StyleListInputView({
      model,
      propertyName: 'styles',
      types,
      translationKeyPrefix: 'pageflow_scrolled.editor.style_list_input'
    });

    const user = userEvent.setup();
    const {getByRole} = render(view);
    await user.click(getByRole('button', {name: 'Remove style'}));

    expect(model.get('styles')).toEqual([])
  });
});
