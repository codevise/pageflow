import Backbone from 'backbone';
import {within} from '@testing-library/dom';
import '@testing-library/jest-dom/extend-expect';

import {
  getByInputPropertyName,
  queryByInputPropertyName,
  getAllByInputPropertyName,
  renderBackboneView
} from 'pageflow/testHelpers';
import {CheckBoxInputView, ConfigurationEditorView, TextInputView} from 'pageflow/ui';

describe('input property name queries', () => {
  it('find input by property name', () => {
    const container = render(function() {
      this.input('title', TextInputView);
      this.input('enabled', CheckBoxInputView);
    });

    expect(within(getByInputPropertyName(container, 'enabled')).getByRole('checkbox'))
      .toBeInTheDocument();
  });

  it('return null for missing input', () => {
    const container = render(function() {
      this.input('title', TextInputView);
    });

    expect(queryByInputPropertyName(container, 'summary')).toBeNull();
  });

  it('throw descriptive error for missing input', () => {
    const container = render(function() {
      this.input('title', TextInputView);
    });

    expect(() => getByInputPropertyName(container, 'summary'))
      .toThrow(/Unable to find an input for property "summary"/);
  });

  it('find inputs hidden via binding', () => {
    const container = render(function() {
      this.input('enabled', CheckBoxInputView);
      this.input('title', TextInputView, {visibleBinding: 'enabled'});
    });

    expect(getByInputPropertyName(container, 'title')).not.toBeVisible();
  });

  it('find all inputs for property', () => {
    const container = render(function() {
      this.input('title', TextInputView);
      this.input('title', TextInputView);
    });

    expect(getAllByInputPropertyName(container, 'title')).toHaveLength(2);
  });
});

function render(fn) {
  const view = new ConfigurationEditorView({model: new Backbone.Model()});
  view.tab('general', fn);
  renderBackboneView(view);

  return view.el;
}
