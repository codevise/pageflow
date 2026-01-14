import {
  HideShowSectionMenuItem,
  DuplicateSectionMenuItem,
  InsertSectionAboveMenuItem,
  InsertSectionBelowMenuItem,
  CutoffSectionMenuItem,
  CopyPermalinkMenuItem,
  DestroySectionMenuItem
} from 'editor/models/sectionMenuItems';

import {useFakeTranslations} from 'pageflow/testHelpers';
import {useEditorGlobals} from 'support';

describe('SectionMenuItems', () => {
  useFakeTranslations({
    'pageflow_scrolled.editor.section_menu_items.hide': 'Hide',
    'pageflow_scrolled.editor.section_menu_items.show': 'Show',
    'pageflow_scrolled.editor.section_menu_items.duplicate': 'Duplicate',
    'pageflow_scrolled.editor.section_menu_items.insert_section_above': 'Insert above',
    'pageflow_scrolled.editor.section_menu_items.insert_section_below': 'Insert below',
    'pageflow_scrolled.editor.section_menu_items.set_cutoff': 'Set cutoff',
    'pageflow_scrolled.editor.section_menu_items.reset_cutoff': 'Reset cutoff',
    'pageflow_scrolled.editor.section_menu_items.copy_permalink': 'Copy permalink',
    'pageflow_scrolled.editor.destroy_section_menu_item.destroy': 'Delete section',
    'pageflow_scrolled.editor.destroy_section_menu_item.confirm_destroy': 'Really delete this section?'
  });

  const {createEntry} = useEditorGlobals();

  describe('HideShowSectionMenuItem', () => {
    it('sets hidden configuration to true when selected', () => {
      const entry = createEntry({sections: [{id: 1}]});
      const section = entry.sections.get(1);
      const menuItem = new HideShowSectionMenuItem({}, {section});

      menuItem.selected();

      expect(section.configuration.get('hidden')).toBe(true);
    });

    it('unsets hidden configuration when already hidden', () => {
      const entry = createEntry({
        sections: [{id: 1, configuration: {hidden: true}}]
      });
      const section = entry.sections.get(1);
      const menuItem = new HideShowSectionMenuItem({}, {section});

      menuItem.selected();

      expect(section.configuration.get('hidden')).toBeUndefined();
    });

    it('has Hide label when section is visible', () => {
      const entry = createEntry({sections: [{id: 1}]});
      const section = entry.sections.get(1);
      const menuItem = new HideShowSectionMenuItem({}, {section});

      expect(menuItem.get('label')).toBe('Hide');
    });

    it('has Show label when section is hidden', () => {
      const entry = createEntry({
        sections: [{id: 1, configuration: {hidden: true}}]
      });
      const section = entry.sections.get(1);
      const menuItem = new HideShowSectionMenuItem({}, {section});

      expect(menuItem.get('label')).toBe('Show');
    });

    it('updates label when hidden state changes', () => {
      const entry = createEntry({sections: [{id: 1}]});
      const section = entry.sections.get(1);
      const menuItem = new HideShowSectionMenuItem({}, {section});

      section.configuration.set('hidden', true);

      expect(menuItem.get('label')).toBe('Show');
    });
  });

  describe('DuplicateSectionMenuItem', () => {
    it('has Duplicate label', () => {
      const entry = createEntry({sections: [{id: 1}]});
      const section = entry.sections.get(1);
      const menuItem = new DuplicateSectionMenuItem({}, {section});

      expect(menuItem.get('label')).toBe('Duplicate');
    });

    it('calls duplicateSection on chapter when selected', () => {
      const entry = createEntry({sections: [{id: 1}]});
      const section = entry.sections.get(1);
      section.chapter.duplicateSection = jest.fn();
      const menuItem = new DuplicateSectionMenuItem({}, {section});

      menuItem.selected();

      expect(section.chapter.duplicateSection).toHaveBeenCalledWith(section);
    });
  });

  describe('InsertSectionAboveMenuItem', () => {
    it('has Insert above label', () => {
      const entry = createEntry({sections: [{id: 1}]});
      const section = entry.sections.get(1);
      const menuItem = new InsertSectionAboveMenuItem({}, {section});

      expect(menuItem.get('label')).toBe('Insert above');
    });

    it('calls insertSection with before option when selected', () => {
      const entry = createEntry({sections: [{id: 1}]});
      const section = entry.sections.get(1);
      section.chapter.insertSection = jest.fn();
      const menuItem = new InsertSectionAboveMenuItem({}, {section});

      menuItem.selected();

      expect(section.chapter.insertSection).toHaveBeenCalledWith({before: section});
    });
  });

  describe('InsertSectionBelowMenuItem', () => {
    it('has Insert below label', () => {
      const entry = createEntry({sections: [{id: 1}]});
      const section = entry.sections.get(1);
      const menuItem = new InsertSectionBelowMenuItem({}, {section});

      expect(menuItem.get('label')).toBe('Insert below');
    });

    it('calls insertSection with after option when selected', () => {
      const entry = createEntry({sections: [{id: 1}]});
      const section = entry.sections.get(1);
      section.chapter.insertSection = jest.fn();
      const menuItem = new InsertSectionBelowMenuItem({}, {section});

      menuItem.selected();

      expect(section.chapter.insertSection).toHaveBeenCalledWith({after: section});
    });
  });

  describe('CutoffSectionMenuItem', () => {
    it('has Set cutoff label when not at section', () => {
      const entry = createEntry({
        site: {cutoff_mode_name: 'subscription_headers'},
        sections: [{id: 1, permaId: 100}]
      });
      const section = entry.sections.get(1);
      const menuItem = new CutoffSectionMenuItem({}, {
        section,
        cutoff: entry.cutoff
      });

      expect(menuItem.get('label')).toBe('Set cutoff');
    });

    it('has Reset cutoff label when at section', () => {
      const entry = createEntry({
        site: {cutoff_mode_name: 'subscription_headers'},
        metadata: {configuration: {cutoff_section_perma_id: 100}},
        sections: [{id: 1, permaId: 100}]
      });
      const section = entry.sections.get(1);
      const menuItem = new CutoffSectionMenuItem({}, {
        section,
        cutoff: entry.cutoff
      });

      expect(menuItem.get('label')).toBe('Reset cutoff');
    });

    it('sets cutoff to section when selected', () => {
      const entry = createEntry({
        site: {cutoff_mode_name: 'subscription_headers'},
        sections: [{id: 1, permaId: 100}]
      });
      const section = entry.sections.get(1);
      const menuItem = new CutoffSectionMenuItem({}, {
        section,
        cutoff: entry.cutoff
      });

      menuItem.selected();

      expect(entry.metadata.configuration.get('cutoff_section_perma_id')).toBe(100);
    });

    it('resets cutoff when already at section', () => {
      const entry = createEntry({
        site: {cutoff_mode_name: 'subscription_headers'},
        metadata: {configuration: {cutoff_section_perma_id: 100}},
        sections: [{id: 1, permaId: 100}]
      });
      const section = entry.sections.get(1);
      const menuItem = new CutoffSectionMenuItem({}, {
        section,
        cutoff: entry.cutoff
      });

      menuItem.selected();

      expect(entry.metadata.configuration.get('cutoff_section_perma_id')).toBeUndefined();
    });
  });

  describe('CopyPermalinkMenuItem', () => {
    it('has Copy permalink label', () => {
      const entry = createEntry({sections: [{id: 1}]});
      const section = entry.sections.get(1);
      const menuItem = new CopyPermalinkMenuItem({}, {entry, section});

      expect(menuItem.get('label')).toBe('Copy permalink');
    });

    it('supports separated attribute', () => {
      const entry = createEntry({sections: [{id: 1}]});
      const section = entry.sections.get(1);
      const menuItem = new CopyPermalinkMenuItem({separated: true}, {entry, section});

      expect(menuItem.get('separated')).toBe(true);
    });

    it('copies permalink to clipboard when selected', () => {
      const entry = createEntry({sections: [{id: 1}]});
      entry.getSectionPermalink = jest.fn().mockReturnValue('http://example.com/section');
      const section = entry.sections.get(1);
      const menuItem = new CopyPermalinkMenuItem({}, {entry, section});
      navigator.clipboard = {writeText: jest.fn()};

      menuItem.selected();

      expect(entry.getSectionPermalink).toHaveBeenCalledWith(section);
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('http://example.com/section');
    });
  });

  describe('DestroySectionMenuItem', () => {
    it('has Delete section label', () => {
      const entry = createEntry({sections: [{id: 1}]});
      const section = entry.sections.get(1);
      const menuItem = new DestroySectionMenuItem({}, {section});

      expect(menuItem.get('label')).toBe('Delete section');
    });

    it('calls destroyWithDelay on section when confirmed', () => {
      const entry = createEntry({sections: [{id: 1}]});
      const section = entry.sections.get(1);
      section.destroyWithDelay = jest.fn();
      const menuItem = new DestroySectionMenuItem({}, {section});
      window.confirm = jest.fn().mockReturnValue(true);

      menuItem.selected();

      expect(window.confirm).toHaveBeenCalledWith('Really delete this section?');
      expect(section.destroyWithDelay).toHaveBeenCalled();
    });
  });
});
