import Backbone from 'backbone';
import '@testing-library/jest-dom/extend-expect';

import {renderConfigurationEditorView, useFakeTranslations} from 'pageflow/testHelpers';
import {ConfigurationEditorView, TextInputView} from 'pageflow/ui';

describe('renderConfigurationEditorView', () => {
  useFakeTranslations({
    'pageflow.ui.configuration_editor.tabs.general': 'General'
  });

  it('returns queries bound to configuration editor', () => {
    const {getByRole} = renderConfigurationEditorView(createConfigurationEditorView());

    expect(getByRole('tab', {name: 'General'})).toBeInTheDocument();
  });

  it('returns input property name queries', () => {
    const {getByInputPropertyName} =
      renderConfigurationEditorView(createConfigurationEditorView());

    expect(getByInputPropertyName('title')).toBeInTheDocument();
  });

  it('returns configuration editor view element as container', () => {
    const view = createConfigurationEditorView();

    const {container} = renderConfigurationEditorView(view);

    expect(container).toBe(view.el);
  });

  it('supports views containing a configuration editor', () => {
    const configurationEditorView = createConfigurationEditorView();
    const view = new (Backbone.View.extend({
      render() {
        this.el.appendChild(configurationEditorView.render().el);
        return this;
      }
    }))();

    const {container, getByInputPropertyName} = renderConfigurationEditorView(view);

    expect(container).toBe(configurationEditorView.el);
    expect(getByInputPropertyName('title')).toBeInTheDocument();
  });
});

function createConfigurationEditorView() {
  const view = new ConfigurationEditorView({model: new Backbone.Model()});

  view.tab('general', function() {
    this.input('title', TextInputView);
  });

  return view;
}
