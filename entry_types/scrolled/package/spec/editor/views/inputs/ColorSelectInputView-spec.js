import {
  ColorSelectInputView
} from 'editor/views/inputs/ColorSelectInputView';
import Backbone from 'backbone';

import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';
import {useReactBasedBackboneViews} from 'support';
import {useFakeTranslations} from 'pageflow/testHelpers';

describe('ColorSelectInputView', () => {
  const {render} = useReactBasedBackboneViews();

  useFakeTranslations({
    'pageflow_scrolled.editor.blank': 'Auto'
  });

  it('renders options for colors', async () => {
    const model = new Backbone.Model();

    const inputView = new ColorSelectInputView({
      model,
      blankTranslationKey: 'pageflow_scrolled.editor.blank',
      values: ['brand-red', 'brand-green'],
      texts: ['Red', 'Green'],
      cssColorPropertyPrefix: '--theme-palette-color',
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
});
