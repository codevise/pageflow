import {
  ColorSelectInputView
} from 'editor/views/inputs/ColorSelectInputView';
import Backbone from 'backbone';

import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';
import {useFakeTranslations} from 'pageflow/testHelpers';
import {renderReactBasedBackboneView as render} from 'pageflow-scrolled/testHelpers';

describe('ColorSelectInputView', () => {
  useFakeTranslations({
    'pageflow_scrolled.editor.blank': 'Auto'
  });

  it('renders options for theme palette colors by default colors', async () => {
    const model = new Backbone.Model();

    const inputView = new ColorSelectInputView({
      model,
      includeBlank: true,
      blankTranslationKey: 'pageflow_scrolled.editor.blank',
      values: ['brand-red', 'brand-green'],
      texts: ['Red', 'Green'],
      propertyName: 'color'
    });

    const user = userEvent.setup();
    const {queryByRole, getByRole} = render(inputView);
    await user.click(getByRole('button', {name: 'Auto'}));

    expect(queryByRole('option', {name: 'Red'})).not.toBeNull();
    expect(queryByRole('option', {name: 'Green'})).not.toBeNull();

    expect(queryByRole('option', {name: 'Red'}).querySelector(
      '[style*="var(--theme-palette-color-brand-red)"]'
    )).not.toBeNull();
    expect(queryByRole('option', {name: 'Green'}).querySelector(
      '[style*="var(--theme-palette-color-brand-green)"]'
    )).not.toBeNull();
  });

  it('supports rendering mutliple color swatches', async () => {
    const model = new Backbone.Model();

    const inputView = new ColorSelectInputView({
      model,
      includeBlank: true,
      blankTranslationKey: 'pageflow_scrolled.editor.blank',
      values: ['brand-red', 'brand-green'],
      texts: ['Red', 'Green'],
      swatches: [
        {cssColorPropertyPrefix: '--theme-light-accent-palette-color'},
        {cssColorPropertyPrefix: '--theme-dark-accent-palette-color'}
      ],
      propertyName: 'color'
    });

    const user = userEvent.setup();
    const {queryByRole, getByRole} = render(inputView);
    await user.click(getByRole('button', {name: 'Auto'}));

    expect(queryByRole('option', {name: 'Red'})).not.toBeNull();
    expect(queryByRole('option', {name: 'Green'})).not.toBeNull();

    expect(queryByRole('option', {name: 'Red'}).querySelector(
      '[style*="var(--theme-light-accent-palette-color-brand-red)"]'
    )).not.toBeNull();
    expect(queryByRole('option', {name: 'Red'}).querySelector(
      '[style*="var(--theme-dark-accent-palette-color-brand-red)"]'
    )).not.toBeNull();
    expect(queryByRole('option', {name: 'Green'}).querySelector(
      '[style*="var(--theme-light-accent-palette-color-brand-green)"]'
    )).not.toBeNull();
    expect(queryByRole('option', {name: 'Green'}).querySelector(
      '[style*="var(--theme-dark-accent-palette-color-brand-green)"]'
    )).not.toBeNull();
  });
});
