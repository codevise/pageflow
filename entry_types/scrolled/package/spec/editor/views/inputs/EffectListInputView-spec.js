import {EffectListInputView} from 'editor/views/inputs/EffectListInputView';

import Backbone from 'backbone';

import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';
import {renderBackboneView as render, useFakeTranslations} from 'pageflow/testHelpers';

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

    const view = new EffectListInputView({model, propertyName: 'effects'});
    view.render();

    expect(view.el).toHaveTextContent('Blur 30');
  });

  it('allows adding effects', async () => {
    const model = new Backbone.Model();

    const view = new EffectListInputView({model, propertyName: 'effects'});

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

    const view = new EffectListInputView({model, propertyName: 'effects'});

    const user = userEvent.setup();
    const {getByRole} = render(view);
    await user.click(getByRole('button', {name: 'Remove effect'}));

    expect(model.get('effects')).toEqual([])
  });
});
