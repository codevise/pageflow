import Backbone from 'backbone';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';

import {RadioButtonGroupInputView} from 'pageflow/ui';

import {useFakeTranslations, renderBackboneView as render} from 'pageflow/testHelpers';

describe('pageflow.RadioButtonGroupInputView', () => {
  var Model = Backbone.Model.extend({
    i18nKey: 'item'
  });

  it('loads value and checks corresponding radio button', () => {
    var model = new Model({position: 'left'});
    var view = new RadioButtonGroupInputView({
      model: model,
      propertyName: 'position',
      values: ['left', 'center', 'right'],
      texts: ['Left', 'Center', 'Right']
    });

    const {getByRole} = render(view);

    expect(getByRole('radio', {name: 'Left'})).toBeChecked();
    expect(getByRole('radio', {name: 'Center'})).not.toBeChecked();
    expect(getByRole('radio', {name: 'Right'})).not.toBeChecked();
  });

  it('saves value on change', async () => {
    var model = new Model();
    var view = new RadioButtonGroupInputView({
      model: model,
      propertyName: 'position',
      values: ['left', 'center', 'right'],
      texts: ['Left', 'Center', 'Right']
    });

    const {getByRole} = render(view);
    await userEvent.click(getByRole('radio', {name: 'Center'}));

    expect(model.get('position')).toEqual('center');
  });

  it('updates checked state when model changes', () => {
    var model = new Model({position: 'left'});
    var view = new RadioButtonGroupInputView({
      model: model,
      propertyName: 'position',
      values: ['left', 'center', 'right'],
      texts: ['Left', 'Center', 'Right']
    });

    const {getByRole} = render(view);
    model.set('position', 'right');

    expect(getByRole('radio', {name: 'Left'})).not.toBeChecked();
    expect(getByRole('radio', {name: 'Right'})).toBeChecked();
  });

  it('renders labels from texts option', () => {
    var model = new Model();
    var view = new RadioButtonGroupInputView({
      model: model,
      propertyName: 'position',
      values: ['left', 'right'],
      texts: ['Align Left', 'Align Right']
    });

    const {getByRole} = render(view);

    expect(getByRole('radio', {name: 'Align Left'})).toBeInTheDocument();
    expect(getByRole('radio', {name: 'Align Right'})).toBeInTheDocument();
  });

  describe('with boolean values', () => {
    it('loads true value', () => {
      var model = new Model({enabled: true});
      var view = new RadioButtonGroupInputView({
        model: model,
        propertyName: 'enabled',
        values: [true, false],
        texts: ['Yes', 'No']
      });

      const {getByRole} = render(view);

      expect(getByRole('radio', {name: 'Yes'})).toBeChecked();
      expect(getByRole('radio', {name: 'No'})).not.toBeChecked();
    });

    it('loads false value', () => {
      var model = new Model({enabled: false});
      var view = new RadioButtonGroupInputView({
        model: model,
        propertyName: 'enabled',
        values: [true, false],
        texts: ['Yes', 'No']
      });

      const {getByRole} = render(view);

      expect(getByRole('radio', {name: 'Yes'})).not.toBeChecked();
      expect(getByRole('radio', {name: 'No'})).toBeChecked();
    });

    it('saves boolean value on change', async () => {
      var model = new Model({enabled: true});
      var view = new RadioButtonGroupInputView({
        model: model,
        propertyName: 'enabled',
        values: [true, false],
        texts: ['Yes', 'No']
      });

      const {getByRole} = render(view);
      await userEvent.click(getByRole('radio', {name: 'No'}));

      expect(model.get('enabled')).toEqual(false);
    });
  });

  describe('with disabled option', () => {
    it('disables all radio buttons when disabled is true', () => {
      var model = new Model({position: 'left'});
      var view = new RadioButtonGroupInputView({
        model: model,
        propertyName: 'position',
        values: ['left', 'center', 'right'],
        texts: ['Left', 'Center', 'Right'],
        disabled: true
      });

      const {getByRole} = render(view);

      expect(getByRole('radio', {name: 'Left'})).toBeDisabled();
      expect(getByRole('radio', {name: 'Center'})).toBeDisabled();
      expect(getByRole('radio', {name: 'Right'})).toBeDisabled();
    });

    it('disables radio buttons when disabledBinding attribute becomes true', () => {
      var model = new Model({position: 'left', locked: false});
      var view = new RadioButtonGroupInputView({
        model: model,
        propertyName: 'position',
        values: ['left', 'center', 'right'],
        texts: ['Left', 'Center', 'Right'],
        disabledBinding: 'locked'
      });

      const {getByRole} = render(view);

      expect(getByRole('radio', {name: 'Left'})).not.toBeDisabled();

      model.set('locked', true);

      expect(getByRole('radio', {name: 'Left'})).toBeDisabled();
      expect(getByRole('radio', {name: 'Center'})).toBeDisabled();
      expect(getByRole('radio', {name: 'Right'})).toBeDisabled();
    });
  });

  describe('without texts option', () => {
    useFakeTranslations({
      'activerecord.values.item.position.left': 'Left',
      'activerecord.values.item.position.right': 'Right'
    });

    it('uses translations based on model i18nKey', () => {
      var model = new Model();
      var view = new RadioButtonGroupInputView({
        model: model,
        propertyName: 'position',
        values: ['left', 'right']
      });

      const {getByRole} = render(view);

      expect(getByRole('radio', {name: 'Left'})).toBeInTheDocument();
      expect(getByRole('radio', {name: 'Right'})).toBeInTheDocument();
    });
  });
});
