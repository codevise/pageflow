import {StyleListInputView} from 'editor/views/inputs/StyleListInputView';

import Backbone from 'backbone';

import {within} from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';
import {useFakeTranslations} from 'pageflow/testHelpers';

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
    const {getByRole} = within(view.render().el);
    await user.click(getByRole('button', {name: 'Add style'}));
    await user.click(getByRole('link', {name: 'Blur'}));

    expect(model.get('styles')).toEqual([{name: 'blur', value: 50}])
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
    const {getByRole} = within(view.render().el);
    await user.click(getByRole('button', {name: 'Remove style'}));

    expect(model.get('styles')).toEqual([])
  });
});
