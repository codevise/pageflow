import {SectionItemView} from 'editor/views/SectionItemView';
import {ListSelection} from 'pageflow/editor';

import {useEditorGlobals, useFakeXhr} from 'support';
import {useFakeTranslations, renderBackboneView as render} from 'pageflow/testHelpers';
import {fireEvent} from '@testing-library/dom';
import '@testing-library/jest-dom/extend-expect';

describe('SectionItemView', () => {
  useFakeXhr();

  useFakeTranslations({
    'pageflow_scrolled.editor.section_menu_items.hide': 'Hide',
    'pageflow_scrolled.editor.section_menu_items.show': 'Show',
    'pageflow_scrolled.editor.section_menu_items.set_cutoff': 'Set cutoff point',
    'pageflow_scrolled.editor.section_menu_items.reset_cutoff': 'Remove cutoff point',
    'pageflow_scrolled.editor.section_item.cutoff': 'Cutoff point',
    'pageflow_scrolled.editor.section_item.drag_hint': 'Drag to move',
    'pageflow_scrolled.editor.section_item.mark': 'Mark section',
  });

  const {createEntry} = useEditorGlobals();

  it('renders menu with section menu items', () => {
    const entry = createEntry({
      sections: [
        {id: 1, permaId: 100}
      ]
    });
    const view = new SectionItemView({
      entry,
      model: entry.sections.get(1)
    });

    const {getByRole} = render(view);

    expect(getByRole('link', {name: 'Hide'})).not.toBeNull();
  });

  it('does not render cutoff menu item by default', () => {
    const entry = createEntry({
      sections: [
        {id: 1, permaId: 100}
      ]
    });
    const view = new SectionItemView({
      entry,
      model: entry.sections.get(1)
    });

    const {queryByRole} = render(view);

    expect(queryByRole('link', {name: 'Set cutoff point'})).toBeNull();
  });

  it('renders cutoff menu item if site has cutoff mode', () => {
    const entry = createEntry({
      site: {
        cutoff_mode_name: 'subscription_headers'
      },
      sections: [
        {id: 1, permaId: 100}
      ]
    });
    const view = new SectionItemView({
      entry,
      model: entry.sections.get(1)
    });

    const {getByRole} = render(view);

    expect(getByRole('link', {name: 'Set cutoff point'})).not.toBeNull();
  });

  it('renders cutoff indicator', () => {
    const entry = createEntry({
      site: {
        cutoff_mode_name: 'subscription_headers'
      },
      sections: [
        {id: 1, permaId: 100},
        {id: 2, permaId: 101}
      ]
    });
    const view = new SectionItemView({
      entry,
      model: entry.sections.get(2)
    });

    const {queryByText} = render(view);
    entry.metadata.configuration.set('cutoff_section_perma_id', 101)

    expect(queryByText('Cutoff point')).toBeVisible();
  });

  it('does not render cutoff indicator if cutoff section not set', () => {
    const entry = createEntry({
      site: {
        cutoff_mode_name: 'subscription_headers'
      },
      sections: [
        {id: 1, permaId: 100},
        {id: 2, permaId: 101}
      ]
    });
    const view = new SectionItemView({
      entry,
      model: entry.sections.get(2)
    });

    const {queryByText} = render(view);

    expect(queryByText('Cutoff point')).not.toBeVisible();
  });

  it('does not render cutoff indicator if site does not have cutoff mode', () => {
    const entry = createEntry({
      metadata: {configuration: {cutoff_section_perma_id: 101}},
      sections: [
        {id: 1, permaId: 100},
        {id: 2, permaId: 101}
      ]
    });
    const view = new SectionItemView({
      entry,
      model: entry.sections.get(2)
    });

    const {queryByText} = render(view);

    expect(queryByText('Cutoff point')).not.toBeVisible();
  });

  describe('active state', () => {
    beforeEach(() => {
      Element.prototype.scrollIntoView = jest.fn();
    });

    it('marks section as active when it is the current section in main storyline', () => {
      const entry = createEntry({
        sections: [
          {id: 1, permaId: 100},
          {id: 2, permaId: 101},
          {id: 3, permaId: 102}
        ]
      });
      const view = new SectionItemView({
        entry,
        model: entry.sections.get(2)
      });

      render(view);
      entry.set('currentSectionIndex', 1);

      expect(view.el).toHaveAttribute('aria-current', 'true');
    });

    it('does not mark section as active when it is not the current section', () => {
      const entry = createEntry({
        sections: [
          {id: 1, permaId: 100},
          {id: 2, permaId: 101},
          {id: 3, permaId: 102}
        ]
      });
      const view = new SectionItemView({
        entry,
        model: entry.sections.get(2)
      });

      render(view);
      entry.set('currentSectionIndex', 0);

      expect(view.el).not.toHaveAttribute('aria-current', 'true');
    });

    it('marks section as active when in excursion and section is current in that excursion', () => {
      const entry = createEntry({
        storylines: [
          {id: 100, role: 'main'},
          {id: 200}
        ],
        chapters: [
          {id: 1, storylineId: 100},
          {id: 2, storylineId: 200}
        ],
        sections: [
          {id: 10, permaId: 100, chapterId: 1},
          {id: 11, permaId: 101, chapterId: 2},
          {id: 12, permaId: 102, chapterId: 2},
          {id: 13, permaId: 103, chapterId: 2}
        ]
      });
      const view = new SectionItemView({
        entry,
        model: entry.sections.get(12)
      });

      render(view);
      entry.set('currentExcursionId', 2);
      entry.set('currentSectionIndex', 1);

      expect(view.el).toHaveAttribute('aria-current', 'true');
    });

    it('does not mark section as active when in excursion but belongs to different chapter', () => {
      const entry = createEntry({
        storylines: [
          {id: 100, role: 'main'},
          {id: 200}
        ],
        chapters: [
          {id: 1, storylineId: 100},
          {id: 2, storylineId: 200}
        ],
        sections: [
          {id: 10, permaId: 100, chapterId: 1},
          {id: 11, permaId: 101, chapterId: 2},
          {id: 12, permaId: 102, chapterId: 2}
        ]
      });
      const view = new SectionItemView({
        entry,
        model: entry.sections.get(10)
      });

      render(view);
      entry.set('currentExcursionId', 2);
      entry.set('currentSectionIndex', 0);

      expect(view.el).not.toHaveAttribute('aria-current', 'true');
    });
  });

  describe('marking', () => {
    function renderSectionItem({markedSections} = {}) {
      const entry = createEntry({sections: [{id: 1, permaId: 100}, {id: 2, permaId: 200}]});
      const section = entry.sections.get(1);
      const view = new SectionItemView({entry, model: section, markedSections});

      return {entry, section, ...render(view)};
    }

    it('does not render mark button without section selection', () => {
      const {queryByRole} = renderSectionItem();

      expect(queryByRole('button', {name: 'Mark section'})).toBeNull();
    });

    it('renders unpressed mark button', () => {
      const {getByRole} = renderSectionItem({markedSections: new ListSelection()});

      expect(getByRole('button', {name: 'Mark section'}))
        .toHaveAttribute('aria-pressed', 'false');
    });

    it('marks section when mark button is clicked', () => {
      const markedSections = new ListSelection();
      const {section, getByRole} = renderSectionItem({markedSections});

      fireEvent.click(getByRole('button', {name: 'Mark section'}));

      expect(markedSections.includes(section)).toBe(true);
      expect(getByRole('button', {name: 'Mark section'}))
        .toHaveAttribute('aria-pressed', 'true');
    });

    it('unmarks marked section when mark button is clicked', () => {
      const markedSections = new ListSelection();
      const {section, getByRole} = renderSectionItem({markedSections});
      markedSections.add(section);

      fireEvent.click(getByRole('button', {name: 'Mark section'}));

      expect(markedSections.includes(section)).toBe(false);
    });

    it('marks section on modifier click', () => {
      const markedSections = new ListSelection();
      const {section, getByTitle} = renderSectionItem({markedSections});

      fireEvent.click(getByTitle('Drag to move'), {ctrlKey: true});

      expect(markedSections.includes(section)).toBe(true);
    });

    it('marks section on click with meta key', () => {
      const markedSections = new ListSelection();
      const {section, getByTitle} = renderSectionItem({markedSections});

      fireEvent.click(getByTitle('Drag to move'), {metaKey: true});

      expect(markedSections.includes(section)).toBe(true);
    });

    it('does not mark section on plain click', () => {
      const markedSections = new ListSelection();
      const {section, getByTitle} = renderSectionItem({markedSections});

      fireEvent.click(getByTitle('Drag to move'));

      expect(markedSections.includes(section)).toBe(false);
    });

    it('also marks section selected in preview on first modifier click', () => {
      const markedSections = new ListSelection();
      const {entry, section, getByTitle} = renderSectionItem({markedSections});
      entry.set('selectedSectionId', 2);

      fireEvent.click(getByTitle('Drag to move'), {ctrlKey: true});

      expect(markedSections.pluck('id')).toEqual([2, 1]);
      expect(markedSections.includes(section)).toBe(true);
    });

    it('does not select section in preview on modifier click', () => {
      const markedSections = new ListSelection();
      const {entry, getByTitle} = renderSectionItem({markedSections});
      const listener = jest.fn();
      entry.on('selectSection', listener);

      fireEvent.click(getByTitle('Drag to move'), {ctrlKey: true});

      expect(listener).not.toHaveBeenCalled();
    });

    it('scrolls to section on modifier click', () => {
      const markedSections = new ListSelection();
      const {entry, section, getByTitle} = renderSectionItem({markedSections});
      const listener = jest.fn();
      entry.on('scrollToSection', listener);

      fireEvent.click(getByTitle('Drag to move'), {ctrlKey: true});

      expect(listener).toHaveBeenCalledWith(section);
    });

    it('does not select section in preview when mark button is clicked', () => {
      const markedSections = new ListSelection();
      const {entry, getByRole} = renderSectionItem({markedSections});
      const listener = jest.fn();
      entry.on('selectSection', listener);

      fireEvent.click(getByRole('button', {name: 'Mark section'}));

      expect(listener).not.toHaveBeenCalled();
    });

    it('scrolls to section when mark button is clicked', () => {
      const markedSections = new ListSelection();
      const {entry, section, getByRole} = renderSectionItem({markedSections});
      const listener = jest.fn();
      entry.on('scrollToSection', listener);

      fireEvent.click(getByRole('button', {name: 'Mark section'}));

      expect(listener).toHaveBeenCalledWith(section);
    });
  });
});
