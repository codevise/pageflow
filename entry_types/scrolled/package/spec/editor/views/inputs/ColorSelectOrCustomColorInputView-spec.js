import {
  ColorSelectOrCustomColorInputView
} from 'editor/views/inputs/ColorSelectOrCustomColorInputView';
import Backbone from 'backbone';

import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';
import {useReactBasedBackboneViews} from 'support';
import {useFakeTranslations} from 'pageflow/testHelpers';

describe('ColorSelectOrCustomColorInputView', () => {
  const {render} = useReactBasedBackboneViews();

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
});
