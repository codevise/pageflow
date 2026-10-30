import {EntryOutlineView} from 'editor/views/EntryOutlineView';
import {ExtractFragmentDialogView} from 'editor/views/ExtractFragmentDialogView';

import {useEditorGlobals} from 'support';
import userEvent from '@testing-library/user-event';
import {screen, within} from '@testing-library/dom';
import {
  useFakeFeatures, useFakeTranslations, renderBackboneView as render
} from 'pageflow/testHelpers';
import '@testing-library/jest-dom/extend-expect';

describe('EntryOutlineView', () => {
  useFakeTranslations({
    'pageflow_scrolled.editor.storylines_tabs.main': 'Main',
    'pageflow_scrolled.editor.storylines_tabs.excursions': 'Excursions',
    'pageflow_scrolled.editor.storyline_item.excursion_blank_slate': 'Excursions provide additional content outside the main path. Create your first excursion.',
    'pageflow_scrolled.editor.entry_outline.trash': 'Deleted content',
    'pageflow_scrolled.editor.entry_outline.reorder_chapters': 'Reorder chapters',
    'pageflow_scrolled.editor.entry_outline.finish_reorder_chapters': 'Finish reordering',
    'pageflow_scrolled.editor.section_item.mark': 'Mark section',
    'pageflow_scrolled.editor.entry_outline.select_sections': 'Select sections',
    'pageflow_scrolled.editor.entry_outline.end_selection': 'End selection',
    'pageflow_scrolled.editor.entry_outline.selected_sections.one': '1 section selected',
    'pageflow_scrolled.editor.entry_outline.selected_sections.other':
      '%{count} sections selected',
    'pageflow_scrolled.editor.extract_sections_fragment_menu_item.label':
      'Add to shared fragments'
  });

  const {createEntry} = useEditorGlobals();

  it('renders chapter links containing chapter titles', () => {
    const entry = createEntry({
      chapters: [
        {
          id: 1,
          permaId: 100,
          position: 0,
          configuration: {
            title: 'First Chapter'
          }
        },
        {
          id: 2,
          permaId: 101,
          position: 1,
          configuration: {
            title: 'Second Chapter'
          }
        }
      ]
    });

    render(new EntryOutlineView({entry}));

    const tablist = screen.getByRole('tablist');
    expect(within(tablist).getByRole('tab', {name: 'Main'})).toBeInTheDocument();
    expect(screen.getByRole('link', {name: /First Chapter/})).toBeInTheDocument();
    expect(screen.getByRole('link', {name: /Second Chapter/})).toBeInTheDocument();
  });

  it('does not render excursions tab without excursions storyline', () => {
    const entry = createEntry({
      chapters: [
        {
          id: 1,
          permaId: 100,
          position: 0,
          configuration: {
            title: 'Only Chapter'
          }
        }
      ]
    });

    render(new EntryOutlineView({entry}));

    const tablist = screen.getByRole('tablist');
    expect(within(tablist).getByRole('tab', {name: 'Main'})).toBeInTheDocument();
    expect(within(tablist).queryByRole('tab', {name: 'Excursions'})).toBeNull();
  });

  it('renders excursion chapters when excursions tab is selected', async () => {
    const entry = createEntry({
      storylines: [
        {
          id: 10,
          permaId: 200,
          position: 0,
          role: 'main'
        },
        {
          id: 11,
          permaId: 201,
          position: 1,
          configuration: {}
        }
      ],
      chapters: [
        {
          id: 1,
          permaId: 100,
          position: 0,
          storylineId: 10,
          configuration: {
            title: 'Main Story Chapter'
          }
        },
        {
          id: 2,
          permaId: 101,
          position: 0,
          storylineId: 11,
          configuration: {
            title: 'Excursion Chapter'
          }
        }
      ]
    });

    const user = userEvent.setup();

    render(new EntryOutlineView({entry}));

    const tablist = screen.getByRole('tablist');
    const excursionsTab = within(tablist).getByRole('tab', {name: 'Excursions'});

    await user.click(excursionsTab);

    expect(screen.getByRole('link', {name: /Excursion Chapter/})).toBeInTheDocument();
  });

  it('defaults to main tab when not in excursion', () => {
    const entry = createEntry({
      storylines: [
        {
          id: 10,
          permaId: 200,
          position: 0,
          role: 'main'
        },
        {
          id: 11,
          permaId: 201,
          position: 1,
          configuration: {}
        }
      ],
      chapters: [
        {
          id: 1,
          permaId: 100,
          position: 0,
          storylineId: 10,
          configuration: {
            title: 'Main Story Chapter'
          }
        },
        {
          id: 2,
          permaId: 101,
          position: 0,
          storylineId: 11,
          configuration: {
            title: 'Excursion Chapter'
          }
        }
      ]
    });

    render(new EntryOutlineView({entry}));

    const tablist = screen.getByRole('tablist');
    const mainTab = within(tablist).getByRole('tab', {name: 'Main'});

    expect(mainTab).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('link', {name: /Main Story Chapter/})).toBeInTheDocument();
  });

  it('defaults to excursions tab when in excursion', () => {
    const entry = createEntry({
      storylines: [
        {
          id: 10,
          permaId: 200,
          position: 0,
          role: 'main'
        },
        {
          id: 11,
          permaId: 201,
          position: 1,
          configuration: {}
        }
      ],
      chapters: [
        {
          id: 1,
          permaId: 100,
          position: 0,
          storylineId: 10,
          configuration: {
            title: 'Main Story Chapter'
          }
        },
        {
          id: 2,
          permaId: 101,
          position: 0,
          storylineId: 11,
          configuration: {
            title: 'Excursion Chapter'
          }
        }
      ]
    });

    entry.set('currentExcursionId', 11);

    render(new EntryOutlineView({entry}));

    const tablist = screen.getByRole('tablist');
    const excursionsTab = within(tablist).getByRole('tab', {name: 'Excursions'});

    expect(excursionsTab).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('link', {name: /Excursion Chapter/})).toBeInTheDocument();
  });

  it('switches to excursions tab when entering excursion', () => {
    const entry = createEntry({
      storylines: [
        {
          id: 10,
          permaId: 200,
          position: 0,
          role: 'main'
        },
        {
          id: 11,
          permaId: 201,
          position: 1,
          configuration: {}
        }
      ],
      chapters: [
        {
          id: 1,
          permaId: 100,
          position: 0,
          storylineId: 10,
          configuration: {
            title: 'Main Story Chapter'
          }
        },
        {
          id: 2,
          permaId: 101,
          position: 0,
          storylineId: 11,
          configuration: {
            title: 'Excursion Chapter'
          }
        }
      ]
    });

    render(new EntryOutlineView({entry}));

    entry.set('currentExcursionId', 11);

    const tablist = screen.getByRole('tablist');
    const excursionsTab = within(tablist).getByRole('tab', {name: 'Excursions'});

    expect(excursionsTab).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('link', {name: /Excursion Chapter/})).toBeInTheDocument();
  });

  it('switches to main tab when leaving excursion', () => {
    const entry = createEntry({
      storylines: [
        {
          id: 10,
          permaId: 200,
          position: 0,
          role: 'main'
        },
        {
          id: 11,
          permaId: 201,
          position: 1,
          configuration: {}
        }
      ],
      chapters: [
        {
          id: 1,
          permaId: 100,
          position: 0,
          storylineId: 10,
          configuration: {
            title: 'Main Story Chapter'
          }
        },
        {
          id: 2,
          permaId: 101,
          position: 0,
          storylineId: 11,
          configuration: {
            title: 'Excursion Chapter'
          }
        }
      ]
    });

    entry.set('currentExcursionId', 11);

    render(new EntryOutlineView({entry}));

    entry.unset('currentExcursionId');

    const tablist = screen.getByRole('tablist');
    const mainTab = within(tablist).getByRole('tab', {name: 'Main'});

    expect(mainTab).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('link', {name: /Main Story Chapter/})).toBeInTheDocument();
  });

  it('displays blank slate on excursions tab when no chapters exist', async () => {
    const entry = createEntry({
      storylines: [
        {
          id: 10,
          permaId: 200,
          position: 0,
          role: 'main'
        },
        {
          id: 11,
          permaId: 201,
          position: 1,
          configuration: {}
        }
      ],
      chapters: [
        {
          id: 1,
          permaId: 100,
          position: 0,
          storylineId: 10,
          configuration: {
            title: 'Main Story Chapter'
          }
        }
      ]
    });

    const user = userEvent.setup();

    render(new EntryOutlineView({entry}));

    const tablist = screen.getByRole('tablist');
    const excursionsTab = within(tablist).getByRole('tab', {name: 'Excursions'});

    await user.click(excursionsTab);

    expect(screen.getByText(/Excursions provide additional content outside the main path/)).toBeInTheDocument();
  });

  it('does not display blank slate on main tab when no chapters exist', () => {
    const entry = createEntry({
      chapters: []
    });

    render(new EntryOutlineView({entry}));

    expect(screen.queryByText(/Excursions provide additional content outside the main path/)).toBeNull();
  });

  it('renders trash button with tooltip', () => {
    const entry = createEntry({});

    render(new EntryOutlineView({entry}));

    expect(screen.getByRole('button', {name: 'Deleted content'}))
      .toHaveAttribute('title', 'Deleted content');
  });

  it('renders trash button for entries with excursions', () => {
    const entry = createEntry({
      storylines: [
        {id: 10, permaId: 200, position: 0, role: 'main'},
        {id: 11, permaId: 201, position: 1, configuration: {}}
      ],
      chapters: [
        {id: 1, permaId: 100, position: 0, storylineId: 10},
        {id: 2, permaId: 101, position: 0, storylineId: 11}
      ]
    });

    render(new EntryOutlineView({entry}));

    expect(screen.getByRole('button', {name: 'Deleted content'})).toBeInTheDocument();
  });

  it('ends chapter reordering when switching storyline tabs', async () => {
    const entry = createEntry({
      storylines: [
        {id: 10, permaId: 200, position: 0, role: 'main'},
        {id: 11, permaId: 201, position: 1, configuration: {}}
      ],
      chapters: [
        {id: 1, permaId: 100, position: 0, storylineId: 10},
        {id: 2, permaId: 101, position: 0, storylineId: 11}
      ]
    });
    const user = userEvent.setup();

    render(new EntryOutlineView({entry}));
    await user.click(screen.getByRole('link', {name: 'Reorder chapters'}));
    await user.click(screen.getByRole('tab', {name: 'Excursions'}));

    expect(screen.getByRole('link', {name: 'Reorder chapters'})).toBeInTheDocument();
  });

  it('does not let sections be marked by default', () => {
    const entry = createEntry({
      chapters: [{id: 1, permaId: 100, position: 0}],
      sections: [{id: 10, permaId: 1000, chapterId: 1}]
    });

    render(new EntryOutlineView({entry}));

    expect(screen.queryByRole('button', {name: 'Mark section'})).toBeNull();
  });

  it('does not offer selecting sections by default', () => {
    render(new EntryOutlineView({entry: createEntry({})}));

    expect(screen.queryByRole('link', {name: 'Select sections'})).toBeNull();
  });

  describe('with fragments feature', () => {
    useFakeFeatures('editor', ['fragments']);

    it('lets sections be marked', async () => {
      const entry = createEntry({
        chapters: [{id: 1, permaId: 100, position: 0}],
        sections: [{id: 10, permaId: 1000, chapterId: 1}]
      });
      const user = userEvent.setup();

      render(new EntryOutlineView({entry}));
      await user.click(screen.getByRole('button', {name: 'Mark section'}));

      expect(screen.getByRole('button', {name: 'Mark section'}))
        .toHaveAttribute('aria-pressed', 'true');
    });

    function createEntryWithSections() {
      return createEntry({
        chapters: [{id: 1, permaId: 100, position: 0}],
        sections: [
          {id: 10, permaId: 1000, chapterId: 1, position: 0},
          {id: 11, permaId: 1100, chapterId: 1, position: 1}
        ]
      });
    }

    it('does not show selection bar while no section is marked', () => {
      render(new EntryOutlineView({entry: createEntryWithSections()}));

      expect(screen.queryByRole('button', {name: 'End selection'})).toBeNull();
    });

    it('shows number of marked sections in selection bar', async () => {
      const user = userEvent.setup();

      render(new EntryOutlineView({entry: createEntryWithSections()}));
      const [first, second] = screen.getAllByRole('button', {name: 'Mark section'});
      await user.click(first);
      await user.click(second);

      expect(screen.getByText('2 sections selected')).toBeInTheDocument();
    });

    it('shows selection bar when selecting sections from menu', async () => {
      const user = userEvent.setup();

      render(new EntryOutlineView({entry: createEntryWithSections()}));
      await user.click(screen.getByRole('link', {name: 'Select sections'}));

      expect(screen.getByText('0 sections selected')).toBeInTheDocument();
    });

    it('offers ending selection in menu while selecting sections', async () => {
      const user = userEvent.setup();

      render(new EntryOutlineView({entry: createEntryWithSections()}));
      await user.click(screen.getByRole('link', {name: 'Select sections'}));
      await user.click(screen.getByRole('link', {name: 'End selection'}));

      expect(screen.queryByRole('button', {name: 'End selection'})).toBeNull();
      expect(screen.getByRole('link', {name: 'Select sections'})).toBeInTheDocument();
    });

    it('renders selection bar between tab bar and chapters', async () => {
      const user = userEvent.setup();

      render(new EntryOutlineView({entry: createEntryWithSections()}));
      await user.click(screen.getByRole('link', {name: 'Select sections'}));
      const bar = screen.getByText('0 sections selected');

      expect(screen.getByRole('tablist').compareDocumentPosition(bar) &
             Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
      expect(screen.getByRole('tabpanel').compareDocumentPosition(bar) &
             Node.DOCUMENT_POSITION_PRECEDING).toBeTruthy();
    });

    it('ends section selection when switching storyline tabs', async () => {
      const entry = createEntry({
        storylines: [
          {id: 10, permaId: 200, position: 0, role: 'main'},
          {id: 11, permaId: 201, position: 1, configuration: {}}
        ],
        chapters: [{id: 1, permaId: 100, position: 0, storylineId: 10}],
        sections: [{id: 10, permaId: 1000, chapterId: 1}]
      });
      const user = userEvent.setup();

      render(new EntryOutlineView({entry}));
      await user.click(screen.getByRole('button', {name: 'Mark section'}));
      await user.click(screen.getByRole('tab', {name: 'Excursions'}));

      expect(screen.queryByRole('button', {name: 'End selection'})).toBeNull();
    });

    it('ends chapter reordering when selecting sections', async () => {
      const user = userEvent.setup();

      render(new EntryOutlineView({entry: createEntryWithSections()}));
      await user.click(screen.getByRole('link', {name: 'Reorder chapters'}));
      await user.click(screen.getByRole('link', {name: 'Select sections'}));

      expect(screen.getByRole('link', {name: 'Reorder chapters'})).toBeInTheDocument();
    });

    it('ends section selection when reordering chapters', async () => {
      const user = userEvent.setup();

      render(new EntryOutlineView({entry: createEntryWithSections()}));
      await user.click(screen.getByRole('link', {name: 'Select sections'}));
      await user.click(screen.getByRole('link', {name: 'Reorder chapters'}));

      expect(screen.queryByRole('button', {name: 'End selection'})).toBeNull();
    });

    it('unmarks sections when selection is ended', async () => {
      const user = userEvent.setup();

      render(new EntryOutlineView({entry: createEntryWithSections()}));
      await user.click(screen.getAllByRole('button', {name: 'Mark section'})[0]);
      await user.click(screen.getByRole('button', {name: 'End selection'}));

      expect(screen.queryByRole('button', {name: 'End selection'})).toBeNull();
      expect(screen.getAllByRole('button', {name: 'Mark section'})[0])
        .toHaveAttribute('aria-pressed', 'false');
    });

    it('shows sections marked before outline was rendered', () => {
      const entry = createEntryWithSections();
      entry.markedSections.add(entry.sections.get(10));

      render(new EntryOutlineView({entry}));

      expect(screen.getByText('1 section selected')).toBeInTheDocument();
      expect(screen.getAllByRole('button', {name: 'Mark section'})[0])
        .toHaveAttribute('aria-pressed', 'true');
    });

    it('ends marking when outline is closed', () => {
      const entry = createEntryWithSections();
      const view = new EntryOutlineView({entry});
      render(view);
      entry.markedSections.add(entry.sections.get(10));

      view.close();

      expect(entry.markedSections.isActive()).toBe(false);
    });

    it('drops removed sections from selection', async () => {
      const entry = createEntryWithSections();
      const user = userEvent.setup();

      render(new EntryOutlineView({entry}));
      const [first, second] = screen.getAllByRole('button', {name: 'Mark section'});
      await user.click(first);
      await user.click(second);
      entry.sections.remove(entry.sections.get(11));

      expect(screen.getByText('1 section selected')).toBeInTheDocument();
    });

    it('adds marked sections to shared fragments', async () => {
      const entry = createEntryWithSections();
      entry.extractSectionsToFragmentLibrary = jest.fn(() => new Promise(() => {}));
      const show = jest.spyOn(ExtractFragmentDialogView, 'show').mockImplementation(() => {});
      const user = userEvent.setup();

      render(new EntryOutlineView({entry}));
      const [first, second] = screen.getAllByRole('button', {name: 'Mark section'});
      await user.click(second);
      await user.click(first);
      await user.click(screen.getByRole('button', {name: 'Add to shared fragments'}));
      show.mock.calls[0][0].onSubmit('Intro');

      expect(entry.extractSectionsToFragmentLibrary).toHaveBeenCalledWith(
        [entry.sections.get(11), entry.sections.get(10)],
        {title: 'Intro'}
      );
      show.mockRestore();
    });

    it('keeps selection while name dialog has not been submitted', async () => {
      const entry = createEntryWithSections();
      const show = jest.spyOn(ExtractFragmentDialogView, 'show').mockImplementation(() => {});
      const user = userEvent.setup();

      render(new EntryOutlineView({entry}));
      await user.click(screen.getAllByRole('button', {name: 'Mark section'})[0]);
      await user.click(screen.getByRole('button', {name: 'Add to shared fragments'}));

      expect(screen.getAllByRole('button', {name: 'Mark section'})[0])
        .toHaveAttribute('aria-pressed', 'true');
      show.mockRestore();
    });

    it('ends selection when name dialog is submitted', async () => {
      const entry = createEntryWithSections();
      entry.extractSectionsToFragmentLibrary = jest.fn(() => new Promise(() => {}));
      const show = jest.spyOn(ExtractFragmentDialogView, 'show').mockImplementation(() => {});
      const user = userEvent.setup();

      render(new EntryOutlineView({entry}));
      await user.click(screen.getAllByRole('button', {name: 'Mark section'})[0]);
      await user.click(screen.getByRole('button', {name: 'Add to shared fragments'}));
      show.mock.calls[0][0].onSubmit('Intro');

      expect(screen.queryByRole('button', {name: 'End selection'})).toBeNull();
      expect(screen.getAllByRole('button', {name: 'Mark section'})[0])
        .toHaveAttribute('aria-pressed', 'false');
      show.mockRestore();
    });
  });
});
