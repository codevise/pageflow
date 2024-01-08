import {
  ListboxInputView
} from 'editor/views/inputs/ListboxInputView';

import Backbone from 'backbone';

import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';
import {useFakeTranslations} from 'pageflow/testHelpers';
import {useReactBasedBackboneViews} from 'support';

describe('ListboxInputView', () => {
  useFakeTranslations({
    'some.key.blank': 'Blank',
    'some.key.default': 'Default',
    'some.key.large': 'Large',
    'some_attributes.variant.values.default': 'Default',
    'some_attributes.variant.values.large': 'Large'
  });

  const {render} = useReactBasedBackboneViews();

  it('renders radio inputs for values', async () => {
    const model = new Backbone.Model({variant: 'large'});
    const inputView = new ListboxInputView({
      model: model,
      propertyName: 'variant',
      values: ['default', 'large'],
      texts: ['Default', 'Large']
    });

    const user = userEvent.setup();
    const {getByRole} = render(inputView);
    await user.click(getByRole('button', {name: 'Large'}));

    expect(getByRole('option', {name: 'Default'})).not.toBeNull();
    expect(getByRole('option', {name: 'Large'})).not.toBeNull();
  });

  it('supports labels based on translation keys', async () => {
    const model = new Backbone.Model({variant: 'large'});
    const inputView = new ListboxInputView({
      model: model,
      propertyName: 'variant',
      values: ['default', 'large'],
      translationKeys: ['some.key.default', 'some.key.large']
    });

    const user = userEvent.setup();
    const {getByRole} = render(inputView);
    await user.click(getByRole('button', {name: 'Large'}));

    expect(getByRole('option', {name: 'Default'})).not.toBeNull();
    expect(getByRole('option', {name: 'Large'})).not.toBeNull();
  });

  it('supports labels based on attribute translation key prefixes', async () => {
    const model = new Backbone.Model({variant: 'large'});
    const inputView = new ListboxInputView({
      model: model,
      propertyName: 'variant',
      values: ['default', 'large'],
      attributeTranslationKeyPrefixes: [
        'some_attributes'
      ],
    });

    const user = userEvent.setup();
    const {getByRole} = render(inputView);
    await user.click(getByRole('button', {name: 'Large'}));

    expect(getByRole('option', {name: 'Default'})).not.toBeNull();
    expect(getByRole('option', {name: 'Large'})).not.toBeNull();
  });

  it('updates selected item when value changes', () => {
    const model = new Backbone.Model({variant: 'default'});
    const inputView = new ListboxInputView({
      model: model,
      propertyName: 'variant',
      values: ['default', 'large'],
      texts: ['Default', 'Large']
    });

    const {getByRole} = render(inputView);
    model.set('variant', 'large')

    expect(getByRole('button', {name: 'Large'})).not.toBeNull();
  });

  it('sets value on change', async () => {
    const model = new Backbone.Model({variant: 'default'});
    const inputView = new ListboxInputView({
      model: model,
      propertyName: 'variant',
      values: ['default', 'large'],
      texts: ['Default', 'Large']
    });

    const user = userEvent.setup();
    const {getByRole} = render(inputView);
    await user.click(getByRole('button', {name: 'Default'}));
    await user.click(getByRole('option', {name: 'Large'}));

    expect(model.get('variant')).toEqual('large');
  });

  it('does not include blank option by defauilt', () => {
    const model = new Backbone.Model();
    const inputView = new ListboxInputView({
      model: model,
      propertyName: 'variant',
      values: ['default', 'large'],
      texts: ['Default', 'Large'],
      blankTranslationKey: 'some.key.blank'
    });

    const {queryByRole} = render(inputView);

    expect(queryByRole('button', {name: 'Blank'})).toBeNull();
  });

  it('includes blank option', () => {
    const model = new Backbone.Model();
    const inputView = new ListboxInputView({
      model: model,
      propertyName: 'variant',
      values: ['default', 'large'],
      texts: ['Default', 'Large'],
      includeBlank: true,
      blankTranslationKey: 'some.key.blank'
    });

    const {getByRole} = render(inputView);

    expect(getByRole('button', {name: 'Blank'})).not.toBeNull();
  });

  it('can be disabled', () => {
    const model = new Backbone.Model();
    const inputView = new ListboxInputView({
      model: model,
      propertyName: 'variant',
      values: ['default', 'large'],
      texts: ['Default', 'Large'],
      disabled: true
    });

    const {getByRole} = render(inputView);

    expect(getByRole('button')).toBeDisabled();
  });

  it('supports custom item rendering for options', async () => {
    const model = new Backbone.Model({variant: 'large'});
    const View = ListboxInputView.extend({
      renderItem(item) {
        return `Item: ${item.text}`;
      }
    })
    const inputView = new View({
      model: model,
      propertyName: 'variant',
      values: ['default', 'large'],
      texts: ['Default', 'Large']
    });

    const user = userEvent.setup();
    const {getByRole} = render(inputView);
    await user.click(getByRole('button', {name: 'Large'}));

    expect(getByRole('option', {name: 'Item: Default'})).not.toBeNull();
    expect(getByRole('option', {name: 'Item: Large'})).not.toBeNull();
  });

  it('supports custom item rendering for selected item', async () => {
    const model = new Backbone.Model({variant: 'large'});
    const View = ListboxInputView.extend({
      renderSelectedItem(item) {
        return `Selected: ${item.text}`;
      }
    })
    const inputView = new View({
      model: model,
      propertyName: 'variant',
      values: ['default', 'large'],
      texts: ['Default', 'Large']
    });

    const {getByRole} = render(inputView);

    expect(getByRole('button', {name: 'Selected: Large'})).not.toBeNull();
  });
});
