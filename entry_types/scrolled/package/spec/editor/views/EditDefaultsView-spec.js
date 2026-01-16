import '@testing-library/jest-dom/extend-expect';
import {fireEvent} from '@testing-library/react';

import {EditDefaultsView} from 'editor/views/EditDefaultsView';
import {features} from 'pageflow/frontend';
import {CheckBoxInputView} from 'pageflow/ui';

import {ConfigurationEditor, useFakeTranslations, renderBackboneView} from 'pageflow/testHelpers';
import {useEditorGlobals} from 'support';

import {editor} from 'editor/api';

describe('EditDefaultsView', () => {
  const {createEntry} = useEditorGlobals();

  useFakeTranslations({
    'pageflow_scrolled.editor.edit_defaults.tabs.sections': 'Sections',
    'pageflow_scrolled.editor.edit_defaults.tabs.content_elements': 'New Elements',
    'pageflow_scrolled.editor.edit_defaults.attributes.defaultSectionLayout.label': 'Default layout',
    'pageflow_scrolled.editor.edit_defaults.attributes.defaultSectionLayout.values.left': 'Left',
    'pageflow_scrolled.editor.edit_defaults.attributes.defaultSectionLayout.values.right': 'Right',
    'pageflow_scrolled.editor.edit_defaults.attributes.defaultSectionLayout.values.center': 'Center',
    'pageflow_scrolled.editor.edit_defaults.attributes.defaultSectionLayout.values.centerRagged': 'Center ragged',
    'pageflow_scrolled.editor.edit_defaults.attributes.defaultSectionPaddingTop.label': 'Default top padding',
    'pageflow_scrolled.editor.edit_defaults.attributes.defaultSectionPaddingBottom.label': 'Default bottom padding',
    'pageflow_scrolled.editor.edit_defaults.attributes.defaultContentElementEnableFullscreen.label': 'Enable fullscreen',
    'pageflow_scrolled.editor.edit_defaults.attributes.defaultContentElementFullWidthInPhoneLayout.label': 'Full width in phone layout',
    'pageflow_scrolled.editor.edit_defaults.content_elements_info': 'Changes to these settings have no effect on existing elements.',
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

  it('renders with content elements tab', () => {
    const entry = createEntry({});

    const view = new EditDefaultsView({
      model: entry.metadata,
      entry
    });

    const {getByRole} = renderBackboneView(view);

    expect(getByRole('tab', {name: 'New Elements'})).toBeInTheDocument();
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

  it('contains defaultContentElementFullWidthInPhoneLayout checkbox input', () => {
    const entry = createEntry({});

    const view = new EditDefaultsView({
      model: entry.metadata,
      entry
    });

    const {getByRole} = renderBackboneView(view);
    fireEvent.click(getByRole('tab', {name: 'New Elements'}));
    const configurationEditor = ConfigurationEditor.find(view);

    expect(configurationEditor.inputPropertyNames()).toContain('defaultContentElementFullWidthInPhoneLayout');
  });

  it('shows info box in content elements tab', () => {
    const entry = createEntry({});

    const view = new EditDefaultsView({
      model: entry.metadata,
      entry
    });

    const {getByRole, getByText} = renderBackboneView(view);
    fireEvent.click(getByRole('tab', {name: 'New Elements'}));

    expect(getByText('Changes to these settings have no effect on existing elements.')).toBeInTheDocument();
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

  describe('with content element type defaultsInputs', () => {
    useFakeTranslations({
      'pageflow_scrolled.editor.edit_defaults.tabs.sections': 'Sections',
      'pageflow_scrolled.editor.edit_defaults.tabs.content_elements': 'New Elements',
      'pageflow_scrolled.editor.edit_defaults.content_elements_info': 'Info',
      'pageflow_scrolled.editor.content_elements.testElement.name': 'Test Element',
      'pageflow_scrolled.editor.content_elements.testElement.description': 'A test element',
      'pageflow_scrolled.editor.content_elements.testElement.defaults.attributes.enableFullscreen.label':
        'Test Fullscreen'
    });

    beforeEach(() => {
      editor.contentElementTypes.register('testElement', {
        defaultsInputs() {
          this.input('enableFullscreen', CheckBoxInputView);
        }
      });
    });

    it('renders separator with type name above inputs', () => {
      const entry = createEntry({});

      const view = new EditDefaultsView({
        model: entry.metadata,
        entry
      });

      const {getByRole, getByText} = renderBackboneView(view);
      fireEvent.click(getByRole('tab', {name: 'New Elements'}));

      expect(getByText('Test Element')).toBeInTheDocument();
    });

    it('renders inputs from content element defaultsInputs with prefixed property name', () => {
      const entry = createEntry({});

      const view = new EditDefaultsView({
        model: entry.metadata,
        entry
      });

      const {getByRole} = renderBackboneView(view);
      fireEvent.click(getByRole('tab', {name: 'New Elements'}));
      const configurationEditor = ConfigurationEditor.find(view);

      expect(configurationEditor.inputPropertyNames()).toContain('default-testElement-enableFullscreen');
    });

    it('applies attributeTranslationKeyPrefixes to inputs', () => {
      const entry = createEntry({});

      const view = new EditDefaultsView({
        model: entry.metadata,
        entry
      });

      const {getByRole, getByText} = renderBackboneView(view);
      fireEvent.click(getByRole('tab', {name: 'New Elements'}));

      expect(getByText('Test Fullscreen')).toBeInTheDocument();
    });
  });

  describe('with multiple content element types with defaultsInputs', () => {
    useFakeTranslations({
      'pageflow_scrolled.editor.edit_defaults.tabs.sections': 'Sections',
      'pageflow_scrolled.editor.edit_defaults.tabs.content_elements': 'New Elements',
      'pageflow_scrolled.editor.edit_defaults.content_elements_info': 'Info',
      'pageflow_scrolled.editor.content_elements.elementA.defaults.attributes.optionA.label': 'Option A',
      'pageflow_scrolled.editor.content_elements.elementB.defaults.attributes.optionB.label': 'Option B'
    });

    beforeEach(() => {
      editor.contentElementTypes.register('elementA', {
        defaultsInputs() {
          this.input('optionA', CheckBoxInputView);
        }
      });
      editor.contentElementTypes.register('elementB', {
        defaultsInputs() {
          this.input('optionB', CheckBoxInputView);
        }
      });
    });

    it('renders inputs from all content element types', () => {
      const entry = createEntry({});

      const view = new EditDefaultsView({
        model: entry.metadata,
        entry
      });

      const {getByRole} = renderBackboneView(view);
      fireEvent.click(getByRole('tab', {name: 'New Elements'}));
      const configurationEditor = ConfigurationEditor.find(view);

      expect(configurationEditor.inputPropertyNames()).toContain('default-elementA-optionA');
      expect(configurationEditor.inputPropertyNames()).toContain('default-elementB-optionB');
    });
  });
});
