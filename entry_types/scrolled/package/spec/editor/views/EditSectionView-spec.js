import {EditSectionView} from 'editor/views/EditSectionView';

import {ConfigurationEditor, DropDownButton, useFakeTranslations} from 'pageflow/testHelpers';
import {useEditorGlobals} from 'support';

describe('EditSectionView', () => {
  const {createEntry} = useEditorGlobals();

  it('does not display backdrop effects input by default', () => {
    const entry = createEntry({sections: [{id: 1}]});

    const view = new EditSectionView({
      model: entry.sections.get(1),
      entry
    });

    view.render();
    const configurationEditor = ConfigurationEditor.find(view);

    expect(configurationEditor.visibleInputPropertyNames())
      .not.toContain('backdropEffects');
  });

  it('displays backdrop effects input if image is present', () => {
    const entry = createEntry({
      imageFiles: [{perma_id: 100}],
      sections: [{id: 1, configuration: {backdropImage: 100}}]
    });

    const view = new EditSectionView({
      model: entry.sections.get(1),
      entry
    });

    view.render();
    const configurationEditor = ConfigurationEditor.find(view);

    expect(configurationEditor.visibleInputPropertyNames())
      .toContain('backdropEffects');
  });

  it('does not display backdrop effects input if referenced image has been deleted', () => {
    const entry = createEntry({
      imageFiles: [],
      sections: [{id: 1, configuration: {backdropImage: 100}}]
    });

    const view = new EditSectionView({
      model: entry.sections.get(1),
      entry
    });

    view.render();
    const configurationEditor = ConfigurationEditor.find(view);

    expect(configurationEditor.visibleInputPropertyNames())
      .not.toContain('backdropEffects');
  });

  it('does not display backdrop effects input if image is present but type is video', () => {
    const entry = createEntry({
      imageFiles: [{perma_id: 100}],
      sections: [{id: 1, configuration: {
        backdropType: 'video',
        backdropImage: 100
      }}]
    });

    const view = new EditSectionView({
      model: entry.sections.get(1),
      entry
    });

    view.render();
    const configurationEditor = ConfigurationEditor.find(view);

    expect(configurationEditor.visibleInputPropertyNames())
      .not.toContain('backdropEffects');
  });

  it('does not display backdrop effects input if image is present but type is color', () => {
    const entry = createEntry({
      imageFiles: [{perma_id: 100}],
      sections: [{id: 1, configuration: {
        backdropType: 'color',
        backdropImage: 100
      }}]
    });

    const view = new EditSectionView({
      model: entry.sections.get(1),
      entry
    });

    view.render();
    const configurationEditor = ConfigurationEditor.find(view);

    expect(configurationEditor.visibleInputPropertyNames())
      .not.toContain('backdropEffects');
  });

  it('displays backdrop effects input if video is present', () => {
    const entry = createEntry({
      videoFiles: [{perma_id: 100}],
      sections: [{id: 1, configuration: {
        backdropType: 'video',
        backdropVideo: 100
      }}]
    });

    const view = new EditSectionView({
      model: entry.sections.get(1),
      entry
    });

    view.render();
    const configurationEditor = ConfigurationEditor.find(view);

    expect(configurationEditor.visibleInputPropertyNames())
      .toContain('backdropEffects');
  });

  it('does not display backdrop effects input if deleted video is referenced', () => {
    const entry = createEntry({
      videoFiles: [],
      sections: [{id: 1, configuration: {
        backdropType: 'video',
        backdropVideo: 100
      }}]
    });

    const view = new EditSectionView({
      model: entry.sections.get(1),
      entry
    });

    view.render();
    const configurationEditor = ConfigurationEditor.find(view);

    expect(configurationEditor.visibleInputPropertyNames())
      .not.toContain('backdropEffects');
  });

  it('does not display mobile backdrop effects input by default', () => {
    const entry = createEntry({sections: [{id: 1}]});

    const view = new EditSectionView({
      model: entry.sections.get(1),
      entry
    });

    view.render();
    const configurationEditor = ConfigurationEditor.find(view);

    expect(configurationEditor.visibleInputPropertyNames())
      .not.toContain('backdropEffectsMobile');
  });

  it('displays mobile backdrop effects input if mobile image is present', () => {
    const entry = createEntry({
      imageFiles: [{perma_id: 100}],
      sections: [{id: 1, configuration: {backdropImageMobile: 100}}]
    });

    const view = new EditSectionView({
      model: entry.sections.get(1),
      entry
    });

    view.render();
    const configurationEditor = ConfigurationEditor.find(view);

    expect(configurationEditor.visibleInputPropertyNames())
      .toContain('backdropEffectsMobile');
  });

  it('does not display mobile backdrop effects if referenced image has been deleted', () => {
    const entry = createEntry({
      imageFiles: [],
      sections: [{id: 1, configuration: {backdropImageMobile: 100}}]
    });

    const view = new EditSectionView({
      model: entry.sections.get(1),
      entry
    });

    view.render();
    const configurationEditor = ConfigurationEditor.find(view);

    expect(configurationEditor.visibleInputPropertyNames())
      .not.toContain('backdropEffectsMobile');
  });

  it('does not display mobile backdrop effects if image is present but type is video', () => {
    const entry = createEntry({
      imageFiles: [{perma_id: 100}],
      sections: [{id: 1, configuration: {
        backdropType: 'video',
        backdropImageMobile: 100
      }}]
    });

    const view = new EditSectionView({
      model: entry.sections.get(1),
      entry
    });

    view.render();
    const configurationEditor = ConfigurationEditor.find(view);

    expect(configurationEditor.visibleInputPropertyNames())
      .not.toContain('backdropEffectsMobile');
  });

  it('displays mobile backdrop effects input if mobile video is present', () => {
    const entry = createEntry({
      videoFiles: [{perma_id: 100}],
      sections: [{id: 1, configuration: {
        backdropType: 'video',
        backdropVideoMobile: 100
      }}]
    });

    const view = new EditSectionView({
      model: entry.sections.get(1),
      entry
    });

    view.render();
    const configurationEditor = ConfigurationEditor.find(view);

    expect(configurationEditor.visibleInputPropertyNames())
      .toContain('backdropEffectsMobile');
  });

  it('does not display mobile backdrop effects input if deleted video is referenced', () => {
    const entry = createEntry({
      videoFiles: [],
      sections: [{id: 1, configuration: {
        backdropType: 'video',
        backdropVideoMobile: 100
      }}]
    });

    const view = new EditSectionView({
      model: entry.sections.get(1),
      entry
    });

    view.render();
    const configurationEditor = ConfigurationEditor.find(view);

    expect(configurationEditor.visibleInputPropertyNames())
      .not.toContain('backdropEffectsMobile');
  });

  describe('actions dropdown', () => {
    useFakeTranslations({
      'pageflow_scrolled.editor.section_menu_items.duplicate': 'Duplicate',
      'pageflow_scrolled.editor.section_menu_items.insert_section_above': 'Insert above',
      'pageflow_scrolled.editor.section_menu_items.insert_section_below': 'Insert below',
      'pageflow_scrolled.editor.section_menu_items.hide': 'Hide',
      'pageflow_scrolled.editor.section_menu_items.copy_permalink': 'Copy permalink',
      'pageflow_scrolled.editor.destroy_section_menu_item.destroy': 'Delete section'
    });

    it('includes section-specific menu items', () => {
      const entry = createEntry({sections: [{id: 1}]});
      const view = new EditSectionView({
        model: entry.sections.get(1),
        entry
      });

      view.render();
      const allDropDowns = DropDownButton.findAll(view);
      const actionsDropDown = allDropDowns[0];

      expect(actionsDropDown.menuItemLabels()).toContain('Duplicate');
      expect(actionsDropDown.menuItemLabels()).toContain('Insert above');
      expect(actionsDropDown.menuItemLabels()).toContain('Insert below');
      expect(actionsDropDown.menuItemLabels()).toContain('Hide');
      expect(actionsDropDown.menuItemLabels()).toContain('Copy permalink');
      expect(actionsDropDown.menuItemLabels()).toContain('Delete section');
    });
  });
});
