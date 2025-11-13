import {EntryOutlineView} from 'editor/views/EntryOutlineView';

import {useEditorGlobals} from 'support';
import userEvent from '@testing-library/user-event';
import {screen, within} from '@testing-library/dom';
import {useFakeTranslations, renderBackboneView as render} from 'pageflow/testHelpers';
import '@testing-library/jest-dom/extend-expect';

describe('EntryOutlineView', () => {
  useFakeTranslations({
    'pageflow_scrolled.editor.storylines_tabs.main': 'Main',
    'pageflow_scrolled.editor.storylines_tabs.excursions': 'Excursions',
    'pageflow_scrolled.editor.storyline_item.excursion_blank_slate': 'Excursions provide additional content outside the main path. Create your first excursion.'
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
          configuration: {main: true}
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
          configuration: {main: true}
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
          configuration: {main: true}
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
          configuration: {main: true}
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
          configuration: {main: true}
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
          configuration: {main: true}
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
});
