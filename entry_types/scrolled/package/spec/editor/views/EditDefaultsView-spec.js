import '@testing-library/jest-dom/extend-expect';

import {EditDefaultsView} from 'editor/views/EditDefaultsView';
import {features} from 'pageflow/frontend';

import {ConfigurationEditor, useFakeTranslations, renderBackboneView} from 'pageflow/testHelpers';
import {useEditorGlobals} from 'support';

describe('EditDefaultsView', () => {
  const {createEntry} = useEditorGlobals();

  useFakeTranslations({
    'pageflow_scrolled.editor.edit_defaults.tabs.sections': 'Sections',
    'pageflow_scrolled.editor.edit_defaults.attributes.defaultSectionLayout.label': 'Default layout',
    'pageflow_scrolled.editor.edit_defaults.attributes.defaultSectionLayout.values.left': 'Left',
    'pageflow_scrolled.editor.edit_defaults.attributes.defaultSectionLayout.values.right': 'Right',
    'pageflow_scrolled.editor.edit_defaults.attributes.defaultSectionLayout.values.center': 'Center',
    'pageflow_scrolled.editor.edit_defaults.attributes.defaultSectionLayout.values.centerRagged': 'Center ragged',
    'pageflow_scrolled.editor.edit_defaults.attributes.defaultSectionPaddingTop.label': 'Default top padding',
    'pageflow_scrolled.editor.edit_defaults.attributes.defaultSectionPaddingBottom.label': 'Default bottom padding',
    'pageflow_scrolled.editor.section_padding_visualization.top_padding': 'TopPadding',
    'pageflow_scrolled.editor.section_padding_visualization.bottom_padding': 'Bottom'
  });

  it('renders with sections tab', () => {
    const entry = createEntry({});

    const view = new EditDefaultsView({
      model: entry.metadata,
      entry
    });

    const {getByRole} = renderBackboneView(view);

    expect(getByRole('tab', {name: 'Sections'})).toBeInTheDocument();
  });

  it('contains defaultSectionLayout select input', () => {
    const entry = createEntry({});

    const view = new EditDefaultsView({
      model: entry.metadata,
      entry
    });

    view.render();
    const configurationEditor = ConfigurationEditor.find(view);

    expect(configurationEditor.inputPropertyNames()).toContain('defaultSectionLayout');
  });

  describe('with section_paddings feature flag', () => {
    beforeEach(() => features.enable('frontend', ['section_paddings']));

    it('contains defaultSectionPaddingTop slider input', () => {
      const entry = createEntry({});

      const view = new EditDefaultsView({
        model: entry.metadata,
        entry
      });

      view.render();
      const configurationEditor = ConfigurationEditor.find(view);

      expect(configurationEditor.inputPropertyNames()).toContain('defaultSectionPaddingTop');
    });

    it('contains defaultSectionPaddingBottom slider input', () => {
      const entry = createEntry({});

      const view = new EditDefaultsView({
        model: entry.metadata,
        entry
      });

      view.render();
      const configurationEditor = ConfigurationEditor.find(view);

      expect(configurationEditor.inputPropertyNames()).toContain('defaultSectionPaddingBottom');
    });

    it('shows padding visualizations', () => {
      const entry = createEntry({});

      const view = new EditDefaultsView({
        model: entry.metadata,
        entry
      });

      const {getByRole} = renderBackboneView(view);

      expect(getByRole('img', {name: 'TopPadding'})).toBeInTheDocument();
      expect(getByRole('img', {name: 'Bottom'})).toBeInTheDocument();
    });
  });
});
