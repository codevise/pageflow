import {SelectableEntryOutlineView} from 'editor/views/SelectableEntryOutlineView';
import {ScrolledEntry} from 'editor/models/ScrolledEntry';

import {factories, normalizeSeed} from 'support';
import {useFakeTranslations, renderBackboneView as render} from 'pageflow/testHelpers';

import userEvent from '@testing-library/user-event';

describe('SelectableEntryOutlineView', () => {
  useFakeTranslations({
    'pageflow_scrolled.editor.selectable_storyline_item.blank_slate': 'No chapters',
    'pageflow_scrolled.editor.selectable_storyline_item.blank_slate_excursions': 'No excursions',
    'pageflow_scrolled.editor.selectable_chapter_item.title': 'Select chapter',
    'pageflow_scrolled.editor.selectable_section_item.title': 'Select section',
    'pageflow_scrolled.editor.selectable_section_item.insert_here': 'Move here',
    'pageflow_scrolled.editor.selectable_section_item.insert_at_beginning': 'Move to beginning',
    'pageflow_scrolled.editor.selectable_section_item.insert_at_end': 'Move to end'
  });

  describe('in default mode', () => {
    it('allows selecting chapter', async () => {
      const entry = factories.entry(ScrolledEntry, {}, {
        entryTypeSeed: normalizeSeed({
          chapters: [{id: 1, permaId: 10}],
          sections: [{id: 1, chapterId: 1}]
        })
      });
      const listener = jest.fn();
      const view = new SelectableEntryOutlineView({
        entry,
        onSelectChapter: listener,
        onSelectSection: jest.fn()
      });

      const user = userEvent.setup();
      const {getByTitle} = render(view);
      await user.click(getByTitle('Select chapter'));

      expect(listener).toHaveBeenCalledWith(entry.chapters.get(1));
    });

    it('allows selecting section', async () => {
      const entry = factories.entry(ScrolledEntry, {}, {
        entryTypeSeed: normalizeSeed({
          chapters: [{id: 1, permaId: 10}],
          sections: [{id: 1, permaId: 100, chapterId: 1}]
        })
      });
      const listener = jest.fn();
      const view = new SelectableEntryOutlineView({
        entry,
        onSelectChapter: jest.fn(),
        onSelectSection: listener
      });

      const user = userEvent.setup();
      const {getByTitle} = render(view);
      await user.click(getByTitle('Select section'));

      expect(listener).toHaveBeenCalledWith(entry.sections.get(1));
    });
  });

  describe('with mode insertPosition', () => {
    it('renders indicator inside upper mask', () => {
      const entry = factories.entry(ScrolledEntry, {}, {
        entryTypeSeed: normalizeSeed({
          sections: [{id: 1, permaId: 10}]
        })
      });
      const view = new SelectableEntryOutlineView({
        entry,
        mode: 'insertPosition',
        onSelectInsertPosition: jest.fn()
      });

      const {getAllByText} = render(view);

      expect(getAllByText('Move here').length).toBe(2);
    });

    it('clicking upper mask calls onSelectInsertPosition with position before', async () => {
      const entry = factories.entry(ScrolledEntry, {}, {
        entryTypeSeed: normalizeSeed({
          sections: [
            {id: 1, permaId: 10}
          ]
        })
      });
      const listener = jest.fn();
      const view = new SelectableEntryOutlineView({
        entry,
        mode: 'insertPosition',
        onSelectInsertPosition: listener
      });

      const user = userEvent.setup();
      const {getAllByText} = render(view);
      await user.click(getAllByText('Move here')[0]);

      expect(listener).toHaveBeenCalledWith({
        section: entry.sections.get(1),
        position: 'before'
      });
    });

    it('clicking lower mask calls onSelectInsertPosition with position after', async () => {
      const entry = factories.entry(ScrolledEntry, {}, {
        entryTypeSeed: normalizeSeed({
          sections: [
            {id: 1, permaId: 10}
          ]
        })
      });
      const listener = jest.fn();
      const view = new SelectableEntryOutlineView({
        entry,
        mode: 'insertPosition',
        onSelectInsertPosition: listener
      });

      const user = userEvent.setup();
      const {getAllByText} = render(view);
      await user.click(getAllByText('Move here')[1]);

      expect(listener).toHaveBeenCalledWith({
        section: entry.sections.get(1),
        position: 'after'
      });
    });
  });

  describe('with mode sectionPart', () => {
    it('renders indicator inside upper mask', () => {
      const entry = factories.entry(ScrolledEntry, {}, {
        entryTypeSeed: normalizeSeed({
          sections: [{id: 1, permaId: 10}]
        })
      });
      const view = new SelectableEntryOutlineView({
        entry,
        mode: 'sectionPart',
        onSelectSectionPart: jest.fn()
      });

      const {getByText} = render(view);

      expect(getByText('Move to beginning')).toBeTruthy();
    });

    it('renders indicator inside lower mask', () => {
      const entry = factories.entry(ScrolledEntry, {}, {
        entryTypeSeed: normalizeSeed({
          sections: [{id: 1, permaId: 10}]
        })
      });
      const view = new SelectableEntryOutlineView({
        entry,
        mode: 'sectionPart',
        onSelectSectionPart: jest.fn()
      });

      const {getByText} = render(view);

      expect(getByText('Move to end')).toBeTruthy();
    });

    it('clicking upper mask calls onSelectSectionPart with part beginning', async () => {
      const entry = factories.entry(ScrolledEntry, {}, {
        entryTypeSeed: normalizeSeed({
          sections: [
            {id: 1, permaId: 10}
          ]
        })
      });
      const listener = jest.fn();
      const view = new SelectableEntryOutlineView({
        entry,
        mode: 'sectionPart',
        onSelectSectionPart: listener
      });

      const user = userEvent.setup();
      const {getByText} = render(view);
      await user.click(getByText('Move to beginning'));

      expect(listener).toHaveBeenCalledWith({
        section: entry.sections.get(1),
        part: 'beginning'
      });
    });

    it('clicking lower mask calls onSelectSectionPart with part end', async () => {
      const entry = factories.entry(ScrolledEntry, {}, {
        entryTypeSeed: normalizeSeed({
          sections: [
            {id: 1, permaId: 10}
          ]
        })
      });
      const listener = jest.fn();
      const view = new SelectableEntryOutlineView({
        entry,
        mode: 'sectionPart',
        onSelectSectionPart: listener
      });

      const user = userEvent.setup();
      const {getByText} = render(view);
      await user.click(getByText('Move to end'));

      expect(listener).toHaveBeenCalledWith({
        section: entry.sections.get(1),
        part: 'end'
      });
    });
  });

  describe('blank slates', () => {
    it('renders blank slate when main storyline has no chapters', () => {
      const entry = factories.entry(ScrolledEntry, {}, {
        entryTypeSeed: normalizeSeed()
      });
      const view = new SelectableEntryOutlineView({
        entry,
        mode: 'sectionPart',
        onSelectSectionPart: jest.fn()
      });

      const {getByText} = render(view);

      expect(getByText('No chapters')).toBeTruthy();
    });
  });
});
