import {EffectListInputView} from 'editor/views/inputs/EffectListInputView';

import Backbone from 'backbone';

import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';
import {renderBackboneView as render, useFakeTranslations} from 'pageflow/testHelpers';
import {factories} from 'support';

describe('EffectListInputView', () => {
  useFakeTranslations({
    'pageflow_scrolled.editor.backdrop_effects.blur.label': 'Blur',
    'pageflow_scrolled.editor.effect_list_input.add': 'Add effect',
    'pageflow_scrolled.editor.effect_list_input.remove': 'Remove effect'
  });

  it('displays effects', () => {
    const model = new Backbone.Model({effects: [
      {name: 'blur', value: 30}
    ]});

    const view = new EffectListInputView({
      model,
      entry: factories.scrolledEntry(),
      propertyName: 'effects'
    });
    view.render();

    expect(view.el).toHaveTextContent('Blur 30');
  });

  it('allows adding effects', async () => {
    const model = new Backbone.Model();

    const view = new EffectListInputView({
      model,
      entry: factories.scrolledEntry(),
      propertyName: 'effects'
    });

    const user = userEvent.setup();
    const {getByRole} = render(view);
    await user.click(getByRole('button', {name: 'Add effect'}));
    await user.click(getByRole('link', {name: 'Blur'}));

    expect(model.get('effects')).toEqual([{name: 'blur', value: 50}])
  });

  it('allows removing effects', async () => {
    const model = new Backbone.Model({effects: [
      {name: 'blur', value: 30}
    ]});

    const view = new EffectListInputView({
      model,
      entry: factories.scrolledEntry(),
      propertyName: 'effects'
    });

    const user = userEvent.setup();
    const {getByRole} = render(view);
    await user.click(getByRole('button', {name: 'Remove effect'}));

    expect(model.get('effects')).toEqual([])
  });

  describe('with effects whose name is not in the type list', () => {
    it('does not render or crash on unknown effect names', () => {
      const model = new Backbone.Model({effects: [
        {name: 'mysteryEffect', value: 42},
        {name: 'blur', value: 30}
      ]});

      const view = new EffectListInputView({
        model,
        entry: factories.scrolledEntry(),
        propertyName: 'effects'
      });
      view.render();

      expect(view.el).toHaveTextContent('Blur 30');
      expect(view.el).not.toHaveTextContent('mysteryEffect');
    });

    it('preserves unknown effects when a known effect is removed', async () => {
      const model = new Backbone.Model({effects: [
        {name: 'mysteryEffect', value: 42},
        {name: 'blur', value: 30}
      ]});

      const view = new EffectListInputView({
        model,
        entry: factories.scrolledEntry(),
        propertyName: 'effects'
      });

      const user = userEvent.setup();
      const {getByRole} = render(view);
      await user.click(getByRole('button', {name: 'Remove effect'}));

      expect(model.get('effects')).toEqual([
        {name: 'mysteryEffect', value: 42}
      ]);
    });

    it('preserves unknown effects when a new effect is added', async () => {
      const model = new Backbone.Model({effects: [
        {name: 'mysteryEffect', value: 42}
      ]});

      const view = new EffectListInputView({
        model,
        entry: factories.scrolledEntry(),
        propertyName: 'effects'
      });

      const user = userEvent.setup();
      const {getByRole} = render(view);
      await user.click(getByRole('button', {name: 'Add effect'}));
      await user.click(getByRole('link', {name: 'Blur'}));

      expect(model.get('effects')).toEqual([
        {name: 'blur', value: 50},
        {name: 'mysteryEffect', value: 42}
      ]);
    });
  });
});
