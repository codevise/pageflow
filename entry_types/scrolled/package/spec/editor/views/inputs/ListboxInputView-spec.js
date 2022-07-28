import {
  ListboxInputView
} from 'editor/views/inputs/ListboxInputView';

import Backbone from 'backbone';

import {within} from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';
import {useFakeTranslations} from 'pageflow/testHelpers';
import {act} from 'react-dom/test-utils'

describe('ListboxInputView', () => {
  useFakeTranslations({
    'some.key.blank': 'Blank',
    'some.key.default': 'Default',
    'some.key.large': 'Large'
  });

  // Since the view uses React internally, it needs to be attached to
  // the DOM in order to make event handling work. We also need to
  // wrap interactions in `act` to make React apply changes.

  let currentElement;

  function render(view) {
    currentElement = view.el;
    document.body.appendChild(view.el);

    return within(view.render().el);
  }

  afterEach(() => {
    if (currentElement) {
      document.body.removeChild(currentElement);
      currentElement = null;
    }
  })

  it('renders radio inputs for values', () => {
    const model = new Backbone.Model({variant: 'large'});
    const inputView = new ListboxInputView({
      model: model,
      propertyName: 'variant',
      values: ['default', 'large'],
      texts: ['Default', 'Large']
    });

    const {getByRole} = render(inputView);
    act(() => userEvent.click(getByRole('button', {name: 'Large'})));

    expect(getByRole('option', {name: 'Default'})).not.toBeNull();
    expect(getByRole('option', {name: 'Large'})).not.toBeNull();
  });

  it('supports labels based on translation keys', () => {
    const model = new Backbone.Model({variant: 'large'});
    const inputView = new ListboxInputView({
      model: model,
      propertyName: 'variant',
      values: ['default', 'large'],
      translationKeys: ['some.key.default', 'some.key.large']
    });

    const {getByRole} = render(inputView);
    act(() => userEvent.click(getByRole('button', {name: 'Large'})));

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

  it('sets value on change', () => {
    const model = new Backbone.Model({variant: 'default'});
    const inputView = new ListboxInputView({
      model: model,
      propertyName: 'variant',
      values: ['default', 'large'],
      texts: ['Default', 'Large']
    });

    const {getByRole} = render(inputView);
    act(() => userEvent.click(getByRole('button', {name: 'Default'})));
    act(() => userEvent.click(getByRole('option', {name: 'Large'})));

    expect(model.get('variant')).toEqual('large');
  });

  it('includes blank option', () => {
    const model = new Backbone.Model();
    const inputView = new ListboxInputView({
      model: model,
      propertyName: 'variant',
      values: ['default', 'large'],
      texts: ['Default', 'Large'],
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
});
