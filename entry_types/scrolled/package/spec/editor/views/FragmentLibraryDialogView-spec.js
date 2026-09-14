import {FragmentLibraryDialogView} from 'editor/views/FragmentLibraryDialogView';
import styles from 'editor/views/FragmentLibraryDialogView.module.css';
import {ScrolledEntry} from 'editor/models/ScrolledEntry';

import {renderBackboneView, setupGlobals, useFakeTranslations} from 'pageflow/testHelpers';
import {factories, normalizeSeed, useFakeXhr} from 'support';

describe('FragmentLibraryDialogView', () => {
  let view, testContext;

  beforeEach(() => testContext = {});
  useFakeXhr(() => testContext);

  useFakeTranslations({
    'pageflow_scrolled.editor.fragment_library.shared': 'Shared fragments',
    'pageflow_scrolled.editor.fragment_library.shared_hint': 'For all members',
    'pageflow_scrolled.editor.fragment_library.blank_slate': 'No fragments yet.',
    'pageflow_scrolled.editor.fragment_library.unnamed': 'Untitled fragment'
  });

  setupGlobals({
    entry: () => factories.entry(ScrolledEntry)
  });

  afterEach(() => view.close());

  function library(attributes, chapters, sections) {
    return {
      collections: {
        storylines: [{id: 1, permaId: 10, configuration: {main: true}}],
        chapters,
        sections,
        contentElements: [],
        imageFiles: []
      },
      ...attributes
    };
  }

  function showDialog(libraries, {renderedBefore = false} = {}) {
    const entry = factories.entry(ScrolledEntry, {}, {entryTypeSeed: normalizeSeed()});
    view = new FragmentLibraryDialogView({entry});

    if (renderedBefore) {
      view.render();
    }

    renderBackboneView(view);

    testContext.server.respondWith(
      'GET', /fragment_libraries/, [200, {'Content-Type': 'application/json'},
                                    JSON.stringify(libraries)]
    );
    testContext.server.respond();

    return view;
  }

  function cardTitles() {
    return [...view.el.querySelectorAll(`.${styles.cardTitle}`)].map(el => el.textContent);
  }

  it('renders shared fragments rail item', () => {
    showDialog([
      library({id: 3, title: 'Shared'},
              [{id: 1, permaId: 100, configuration: {title: 'Intro'}}],
              [{id: 10, permaId: 1000, chapterId: 1, configuration: {}}])
    ]);

    expect(view.el.querySelector(`.${styles.rail}`).textContent)
      .toMatch(/Shared fragments\s*For all members/);
  });

  it('renders shared fragments rail item without libraries', () => {
    showDialog([]);

    expect(view.el.querySelector(`.${styles.rail}`).textContent)
      .toContain('Shared fragments');
  });

  it('renders blank slate without libraries', () => {
    showDialog([]);

    expect(view.el.querySelector(`.${styles.cards}`).textContent)
      .toContain('No fragments yet.');
  });

  it('only renders fragments of first library', () => {
    showDialog([
      library({id: 3, title: 'Shared'},
              [{id: 1, permaId: 100, configuration: {title: 'Intro'}}],
              [{id: 10, permaId: 1000, chapterId: 1, configuration: {}}]),
      library({id: 4, title: 'Other'},
              [{id: 2, permaId: 200, configuration: {title: 'Outro'}}],
              [{id: 11, permaId: 1100, chapterId: 2, configuration: {}}])
    ]);

    expect(cardTitles()).toEqual(['Intro']);
  });

  it('renders card per fragment', () => {
    showDialog([
      library({id: 3, title: 'Templates'},
              [{id: 1, permaId: 100, configuration: {title: 'Title with video'}}],
              [{id: 10, permaId: 1000, chapterId: 1, configuration: {}}])
    ]);

    expect(cardTitles()).toEqual(['Title with video']);
  });

  it('falls back to placeholder title for unnamed fragment', () => {
    showDialog([
      library({id: 3, title: 'Templates'},
              [{id: 1, permaId: 100, configuration: {}}],
              [{id: 10, permaId: 1000, chapterId: 1, configuration: {}}])
    ]);

    expect(cardTitles()).toContain('Untitled fragment');
  });

  it('renders cards once even if view is rendered repeatedly before being shown', () => {
    showDialog([
      library({id: 3, title: 'Templates'},
              [{id: 1, permaId: 100, configuration: {title: 'Intro'}}],
              [{id: 10, permaId: 1000, chapterId: 1, configuration: {}}])
    ], {renderedBefore: true});

    expect(cardTitles()).toEqual(['Intro']);
  });

  it('marks clicked card as selected', () => {
    showDialog([
      library({id: 3, title: 'Templates'},
              [{id: 1, permaId: 100, configuration: {title: 'Intro'}},
               {id: 2, permaId: 200, configuration: {title: 'Outro'}}],
              [{id: 10, permaId: 1000, chapterId: 1, configuration: {}},
               {id: 11, permaId: 1100, chapterId: 2, configuration: {}}])
    ]);

    const cardButtons = view.el.querySelectorAll(`.${styles.cardButton}`);
    cardButtons[1].click();

    expect(cardButtons[1].classList).toContain(styles.selectedCard);
    expect(cardButtons[0].classList).not.toContain(styles.selectedCard);
  });
});
