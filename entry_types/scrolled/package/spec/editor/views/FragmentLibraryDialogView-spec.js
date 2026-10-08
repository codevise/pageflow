import {FragmentLibraryDialogView} from 'editor/views/FragmentLibraryDialogView';
import styles from 'editor/views/FragmentLibraryDialogView.module.css';
import previewStyles from 'editor/views/FragmentPreviewView.module.css';
import dialogViewStyles from 'editor/views/mixins/dialogView.module.css';
import {FragmentPreviewView} from 'editor/views/FragmentPreviewView';
import {ScrolledEntry} from 'editor/models/ScrolledEntry';

import {cssModulesUtils} from 'pageflow/ui';
import {renderBackboneView, setupGlobals, useFakeTranslations} from 'pageflow/testHelpers';
import {factories, normalizeSeed, useFakeXhr} from 'support';
import 'support/fakeResizeObserver';

describe('FragmentLibraryDialogView', () => {
  let view, testContext;

  beforeEach(() => {
    testContext = {};
    renderFragmentPreviewSeedTemplate();
  });

  useFakeXhr(() => testContext);

  useFakeTranslations({
    'pageflow_scrolled.editor.fragment_library.shared': 'Shared fragments',
    'pageflow_scrolled.editor.fragment_library.shared_hint': 'For all members',
    'pageflow_scrolled.editor.fragment_library.blank_slate': 'No fragments yet.',
    'pageflow_scrolled.editor.fragment_library.unnamed': 'Untitled fragment',
    'pageflow_scrolled.editor.fragment_library.insert': 'Insert fragment'
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

  function showDialog(libraries, {chapter, renderedBefore = false} = {}) {
    const entry = factories.entry(ScrolledEntry, {}, {entryTypeSeed: normalizeSeed()});
    view = new FragmentLibraryDialogView({entry, chapter});

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

describe('FragmentLibraryDialogView preview pane', () => {
  let view, testContext;

  beforeEach(() => {
    testContext = {};
    window.localStorage.clear();
    renderFragmentPreviewSeedTemplate();
  });

  useFakeXhr(() => testContext);

  useFakeTranslations({
    'pageflow_scrolled.editor.fragment_library.insert': 'Insert fragment',
    'pageflow_scrolled.editor.fragment_library.unnamed': 'Untitled fragment'
  });

  setupGlobals({
    entry: () => factories.entry(ScrolledEntry)
  });

  afterEach(() => view.close());

  function libraries() {
    return [{
      id: 3,
      title: 'Templates',
      collections: {
        storylines: [{id: 1, permaId: 10, configuration: {main: true}}],
        chapters: [{id: 1, permaId: 100, configuration: {title: 'Intro'}},
                   {id: 2, permaId: 200, configuration: {title: 'Outro'}}],
        sections: [{id: 10, permaId: 1000, chapterId: 1, configuration: {}},
                   {id: 11, permaId: 1100, chapterId: 2, configuration: {}}],
        contentElements: [],
        imageFiles: []
      }
    }];
  }

  function showDialog({chapter, fragmentLibraries = libraries()} = {}) {
    const entry = factories.entry(ScrolledEntry, {}, {entryTypeSeed: normalizeSeed()});
    view = new FragmentLibraryDialogView({entry, chapter});

    renderBackboneView(view);

    testContext.server.respondWith(
      'GET', /fragment_libraries/, [200, {'Content-Type': 'application/json'},
                                    JSON.stringify(fragmentLibraries)]
    );
    testContext.server.respond();

    return view;
  }

  function selectedCardTitle() {
    return view.el.querySelector(`.${styles.selectedCard} .${styles.cardTitle}`).textContent;
  }

  function clickInsert() {
    view.el.querySelector(cssModulesUtils.selector(styles, 'insert')).click();
  }

  it('does not load preview before dialog is shown', () => {
    const entry = factories.entry(ScrolledEntry, {}, {entryTypeSeed: normalizeSeed()});
    view = new FragmentLibraryDialogView({entry});

    view.render();

    expect(testContext.requests).toHaveLength(0);
  });

  it('renders preview inside its own positioned root', () => {
    showDialog();

    const iframe = view.el.querySelector(`.${previewStyles.iframe}`);

    expect(iframe.closest(`.${previewStyles.root}`)).toBeTruthy();
  });

  it('places preview pane above cards beside rail', () => {
    showDialog();

    const body = view.el.querySelector(`.${styles.body}`);
    const content = view.el.querySelector(`.${styles.content}`);

    expect([...body.children].map(child => child.className)).toEqual([
      styles.rail, styles.content
    ]);
    expect([...content.children].map(child => child.className)).toEqual([
      styles.pane, styles.cards
    ]);
  });

  it('places insert button in dialog footer beside cancel button', () => {
    showDialog();

    const footer = view.el.querySelector(`.${dialogViewStyles.footer}`);

    expect(footer.querySelector(cssModulesUtils.selector(styles, 'insert'))).toBeTruthy();
    expect(footer.querySelector(cssModulesUtils.selector(dialogViewStyles, 'close')))
      .toBeTruthy();
  });

  it('previews fragment with collections of the edited entry beneath', () => {
    const showCollections = jest.spyOn(FragmentPreviewView.prototype, 'showCollections');

    showDialog();

    expect(showCollections).toHaveBeenCalledWith(expect.objectContaining({
      entries: expect.any(Array),
      sections: [expect.objectContaining({permaId: 1000})]
    }));

    showCollections.mockRestore();
  });

  it('renders desktop preview before phone preview', () => {
    showDialog();

    const iframes = view.el.querySelectorAll(`.${previewStyles.iframe}`);

    expect([...iframes].map(iframe => [iframe.style.width, iframe.style.height]))
      .toEqual([['1280px', '800px'], ['375px', '667px']]);
  });

  it('shows selected fragment in both previews', () => {
    const showCollections = jest.spyOn(FragmentPreviewView.prototype, 'showCollections');

    showDialog();

    expect(new Set(showCollections.mock.instances).size).toEqual(2);

    showCollections.mockRestore();
  });

  it('opens on first fragment', () => {
    showDialog();

    expect(selectedCardTitle()).toEqual('Intro');
  });

  it('opens on last used fragment', () => {
    window.localStorage.setItem('pageflow.scrolled.fragmentLibrary.lastUsed', '3-200');
    showDialog();

    expect(selectedCardTitle()).toEqual('Outro');
  });

  it('previews clicked fragment', () => {
    const showCollections = jest.spyOn(FragmentPreviewView.prototype, 'showCollections');
    showDialog();

    view.el.querySelectorAll(`.${styles.cardButton}`)[1].click();

    expect(showCollections).toHaveBeenLastCalledWith(expect.objectContaining({
      sections: [expect.objectContaining({permaId: 1100})]
    }));
  });

  it('inserts selected fragment into chapter', () => {
    const chapter = {addSection: jest.fn(), insertFragment: jest.fn()};
    showDialog({chapter});

    clickInsert();

    expect(chapter.insertFragment).toHaveBeenCalledWith(
      expect.objectContaining({id: '3-100'})
    );
  });

  it('remembers inserted fragment', () => {
    showDialog({chapter: {addSection: jest.fn(), insertFragment: jest.fn()}});

    clickInsert();

    expect(window.localStorage.getItem('pageflow.scrolled.fragmentLibrary.lastUsed'))
      .toEqual('3-100');
  });

  it('disables insert button without fragments', () => {
    showDialog({fragmentLibraries: []});

    expect(view.el.querySelector(cssModulesUtils.selector(styles, 'insert')).disabled)
      .toBe(true);
  });
});

function renderFragmentPreviewSeedTemplate() {
  document.body.innerHTML = `
    <script type="text/html" data-template="fragment_preview_seed">
      <!DOCTYPE html>
      <html><head><\\/head><body><\\/body><\\/html>
    </script>
  `;
}
