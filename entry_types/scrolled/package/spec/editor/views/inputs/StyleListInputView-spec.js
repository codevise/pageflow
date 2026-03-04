import {StyleListInputView} from 'editor/views/inputs/StyleListInputView';

import Backbone from 'backbone';

import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';
import {renderBackboneView as render, useFakeTranslations} from 'pageflow/testHelpers';

import styles from 'editor/views/inputs/StyleListInputView.module.css';

describe('StyleListInputView', () => {
  useFakeTranslations({
    'pageflow_scrolled.editor.style_list_input.add': 'Add style',
    'pageflow_scrolled.editor.style_list_input.remove': 'Remove style'
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
