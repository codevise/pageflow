import Backbone from 'backbone';

import {SelectableEntryOutlineView} from 'editor/views/SelectableEntryOutlineView';
import {ScrolledEntry} from 'editor/models/ScrolledEntry';

import {factories, normalizeSeed} from 'support';
import {useFakeTranslations, renderBackboneView as render} from 'pageflow/testHelpers';

import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';

describe('SelectableEntryOutlineView', () => {
  useFakeTranslations({
    'pageflow_scrolled.editor.selectable_storyline_item.blank_slate': 'No chapters',
    'pageflow_scrolled.editor.selectable_storyline_item.blank_slate_excursions': 'No excursions',
    'pageflow_scrolled.editor.selectable_chapter_item.title': 'Select chapter',
    'pageflow_scrolled.editor.selectable_chapter_item.insert_here': 'Move to chapter',
    'pageflow_scrolled.editor.selectable_section_item.title': 'Select section',
    'pageflow_scrolled.editor.selectable_section_item.insert_here': 'Move here',
    'pageflow_scrolled.editor.selectable_section_item.insert_at_beginning': 'Move to beginning',
    'pageflow_scrolled.editor.selectable_section_item.insert_at_end': 'Move to end',
    'pageflow_scrolled.editor.storylines_tabs.main': 'Outline',
    'pageflow_scrolled.editor.storylines_tabs.excursions': 'Excursions'
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

    it('clicking empty chapter insert mask calls onSelectInsertPosition with position into', async () => {
      const entry = factories.entry(ScrolledEntry, {}, {
        entryTypeSeed: normalizeSeed({
          chapters: [{id: 1}]
        })
      });
      const listener = jest.fn();
      const view = new SelectableEntryOutlineView({
        entry,
        mode: 'insertPosition',
        onSelectInsertPosition: listener
      });

      const user = userEvent.setup();
      const {getByText} = render(view);
      await user.click(getByText('Move to chapter'));

      expect(listener).toHaveBeenCalledWith({
        chapter: entry.chapters.get(1),
        position: 'into'
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

  describe('with selection', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      Element.prototype.scrollIntoView = jest.fn();
    });

    afterEach(() => {
      jest.useRealTimers();
      delete Element.prototype.scrollIntoView;
    });

    function createEntry() {
      return factories.entry(ScrolledEntry, {}, {
        entryTypeSeed: normalizeSeed({
          storylines: [
            {id: 1, configuration: {main: true}},
            {id: 2}
          ],
          chapters: [
            {id: 1, storylineId: 1, permaId: 10, configuration: {title: 'Intro'}},
            {id: 2, storylineId: 1, permaId: 20, configuration: {title: 'Outro'}},
            {id: 3, storylineId: 2, permaId: 30, configuration: {title: 'Excursion'}}
          ],
          sections: [
            {id: 1, chapterId: 1, permaId: 100},
            {id: 2, chapterId: 2, permaId: 200},
            {id: 3, chapterId: 3, permaId: 300}
          ]
        })
      });
    }

    function renderOutline(selection) {
      const view = new SelectableEntryOutlineView({
        entry: createEntry(),
        selection,
        onSelectChapter: jest.fn(),
        onSelectSection: jest.fn()
      });

      return render(view);
    }

    it('marks selected chapter as current', () => {
      const {getByText} = renderOutline(new Backbone.Model({chapter: 20}));

      expect(getByText('Outro').closest('li')).toHaveAttribute('aria-current', 'true');
      expect(getByText('Intro').closest('li')).not.toHaveAttribute('aria-current');
    });

    it('marks selected section as current', () => {
      const {getAllByTitle} = renderOutline(new Backbone.Model({section: 200}));

      expect(getAllByTitle('Select section').map(link =>
        link.closest('li').getAttribute('aria-current')
      )).toEqual([null, 'true']);
    });

    it('updates when selection changes', () => {
      const selection = new Backbone.Model({chapter: 20});
      const {getByText} = renderOutline(selection);

      selection.set({chapter: 10});

      expect(getByText('Intro').closest('li')).toHaveAttribute('aria-current', 'true');
      expect(getByText('Outro').closest('li')).not.toHaveAttribute('aria-current');
    });

    it('displays excursions tab if selected chapter is an excursion', () => {
      const {getByRole} = renderOutline(new Backbone.Model({chapter: 30}));

      expect(getByRole('tab', {name: 'Excursions'})).toHaveAttribute('aria-selected', 'true');
    });

    it('scrolls top of selected chapter into view', () => {
      const {getByText} = renderOutline(new Backbone.Model({chapter: 20}));
      jest.runAllTimers();

      expect(Element.prototype.scrollIntoView).toHaveBeenCalledTimes(1);
      expect(Element.prototype.scrollIntoView).toHaveBeenCalledWith({block: 'start'});
      expect(Element.prototype.scrollIntoView.mock.instances[0])
        .toBe(getByText('Outro').closest('li'));
    });

    it('scrolls selected section into view', () => {
      const {getAllByTitle} = renderOutline(new Backbone.Model({section: 200}));
      jest.runAllTimers();

      expect(Element.prototype.scrollIntoView).toHaveBeenCalledTimes(1);
      expect(Element.prototype.scrollIntoView.mock.instances[0])
        .toBe(getAllByTitle('Select section')[1].closest('li'));
    });
  });
});
