import '@testing-library/jest-dom/extend-expect';

import {InsertContentElementDialogView} from 'editor/views/InsertContentElementDialogView';
import {ScrolledEntry} from 'editor/models/ScrolledEntry';
import {Fragment} from 'editor/models/Fragment';

import {factories, normalizeSeed, useFakeXhr} from 'support';
import {
  renderBackboneView, setupGlobals, useFakeFeatures, useFakeTranslations
} from 'pageflow/testHelpers';
import {app} from 'pageflow/editor';
import {fireEvent, within} from '@testing-library/dom';
import 'support/fakeResizeObserver';

import $ from 'jquery';

describe('InsertContentElementDialogView', () => {
  useFakeTranslations({
    'pageflow_scrolled.editor.content_element_categories.basic.name': 'Basic',
    'pageflow_scrolled.editor.content_elements.textBlock.name': 'Text block',
    'pageflow_scrolled.editor.content_elements.inlineImage.name': 'Image',
    'pageflow_scrolled.editor.content_elements.inlineVideo.name': 'Video',
    'pageflow_scrolled.editor.content_elements.heading.name': 'Heading',
    'pageflow_scrolled.editor.insert_content_element.tabs.contentElementTypes': 'New element',
    'pageflow_scrolled.editor.insert_content_element.tabs.fragments': 'Fragments',
    'pageflow_scrolled.editor.insert_content_element.fragments_heading': 'Shared fragments',
    'pageflow_scrolled.editor.insert_content_element.fragments_blank_slate': 'No fragments yet.',
    'pageflow_scrolled.editor.insert_content_element.fragments_load_failed': 'Could not load.',
    'pageflow_scrolled.editor.insert_content_element.insert_fragment_failed': 'Could not insert.',
    'pageflow_scrolled.editor.insert_content_element.unnamed_fragment': 'Untitled fragment'
  });

  it('renders list of content element types', () => {
    const editor = factories.editorApi();
    editor.contentElementTypes.register('textBlock', {});
    const entry = factories.entry(ScrolledEntry, {}, {
      entryTypeSeed: normalizeSeed({
        contentElements: [
          {id: 1, configuration: {}}
        ]
      })
    });
    const view = new InsertContentElementDialogView({
      entry,
      editor,
      insertOptions: {at: 'after', id: 1}
    });

    view.render();

    expect(availableTypeNames(view)).toContain('Text block');
  });

  it('renders list of content element type categories', () => {
    const editor = factories.editorApi();
    editor.contentElementTypes.register('textBlock', {
      category: 'basic'
    });
    const entry = factories.entry(ScrolledEntry, {}, {
      entryTypeSeed: normalizeSeed({
        contentElements: [
          {id: 1, configuration: {}}
        ]
      })
    });
    const view = new InsertContentElementDialogView({
      entry,
      editor,
      insertOptions: {at: 'after', id: 1}
    });

    view.render();

    expect(availableCategories(view)).toContain('Basic');
  });

  it('disables content element types that do backdrop position when inserting in backdrop', () => {
    const editor = factories.editorApi();
    editor.contentElementTypes.register('textBlock', {supportedPositions: ['inline']});
    editor.contentElementTypes.register('inlineVideo', {supportedPositions: ['inline', 'backdrop']});
    const entry = factories.entry(ScrolledEntry, {}, {
      entryTypeSeed: normalizeSeed({
        contentElements: [
          {id: 1, configuration: {}}
        ]
      })
    });
    const view = new InsertContentElementDialogView({
      entry,
      editor,
      insertOptions: {at: 'backdropOfSection', id: 1}
    });

    view.render();

    expect(disabledTypeNames(view)).toContain('Text block');
    expect(availableTypeNames(view)).toContain('Video');
  });

  it('does not render tabs without fragments feature', () => {
    const editor = factories.editorApi();
    editor.contentElementTypes.register('textBlock', {});
    const entry = factories.entry(ScrolledEntry, {}, {
      entryTypeSeed: normalizeSeed({contentElements: [{id: 1}]})
    });
    const view = new InsertContentElementDialogView({
      entry,
      editor,
      insertOptions: {at: 'after', id: 1}
    });

    const {queryAllByRole} = renderBackboneView(view);

    expect(queryAllByRole('tab')).toHaveLength(0);
  });

  describe('with fragments feature', () => {
    let testContext;

    beforeEach(() => {
      testContext = {};
    });

    useFakeFeatures('editor', ['fragments']);
    useFakeXhr(() => testContext);

    setupGlobals({
      entry: () => factories.entry(ScrolledEntry)
    });

    function renderDialog({libraries = [], insertOptions = {at: 'after', id: 1}} = {}) {
      const editor = factories.editorApi();
      editor.contentElementTypes.register('textBlock', {
        category: 'basic',
        supportedPositions: ['inline']
      });
      const entry = factories.entry(ScrolledEntry, {}, {
        entryTypeSeed: normalizeSeed({sections: [{id: 5}], contentElements: [{id: 1, sectionId: 5}]})
      });
      entry.insertContentElementFragment = jest.fn(() => new Promise(() => {}));
      const view = new InsertContentElementDialogView({
        entry,
        editor,
        insertOptions
      });

      testContext.server.respondWith(
        'GET', /fragment_libraries/, [200, {'Content-Type': 'application/json'},
                                      JSON.stringify(libraries)]
      );

      return {view, entry, ...renderBackboneView(view)};
    }

    function showLibraryTab({getByRole}) {
      fireEvent.click(getByRole('tab', {name: 'Fragments'}));
      testContext.server.respond();
    }

    function library(chapters, sections, contentElements) {
      return {
        id: 3,
        collections: {
          storylines: [{id: 1, permaId: 10, role: 'main'}],
          chapters,
          sections,
          contentElements,
          imageFiles: []
        }
      };
    }

    const elementsFragment = {
      title: 'Pull quote',
      chapter: {
        id: 1, permaId: 100,
        configuration: {title: 'Pull quote', fragment: {kind: 'contentElements'}}
      }
    };

    it('renders tabs for new elements and library', () => {
      const {getAllByRole} = renderDialog();

      expect(getAllByRole('tab').map(tab => tab.textContent))
        .toEqual(['New element', 'Fragments']);
    });

    it('shows content element types by default', () => {
      const {getByRole} = renderDialog();

      expect(within(getByRole('tabpanel')).getByText('Text block')).toBeTruthy();
      expect(within(getByRole('tabpanel')).getByText('Basic')).toBeTruthy();
    });

    it('renders card per content elements fragment in library tab', () => {
      const result = renderDialog({
        libraries: [library(
          [
            elementsFragment.chapter,
            {id: 2, permaId: 200, configuration: {title: 'Intro'}}
          ],
          [
            {id: 10, permaId: 1000, chapterId: 1, configuration: {}},
            {id: 11, permaId: 1100, chapterId: 2, configuration: {}}
          ],
          [
            {id: 20, permaId: 2000, sectionId: 10, typeName: 'heading', configuration: {}},
            {id: 21, permaId: 2100, sectionId: 10, typeName: 'textBlock', configuration: {}},
            {id: 22, permaId: 2200, sectionId: 10, typeName: 'heading', configuration: {}}
          ]
        )]
      });

      showLibraryTab(result);

      const items = within(result.getByRole('tabpanel')).getAllByRole('listitem');
      expect(items).toHaveLength(1);
      expect(items[0]).toHaveTextContent('Pull quote');
      expect(items[0]).toHaveTextContent('Heading, Text block');
    });

    it('renders heading above fragments', () => {
      const result = renderDialog();

      showLibraryTab(result);

      expect(within(result.getByRole('tabpanel')).getByRole('heading', {name: 'Shared fragments'}))
        .toBeTruthy();
    });

    function elementsFragmentLibrary() {
      return library(
        [elementsFragment.chapter],
        [{id: 10, permaId: 1000, chapterId: 1, configuration: {}}],
        [{id: 20, permaId: 2000, sectionId: 10, typeName: 'heading', configuration: {}}]
      );
    }

    it('inserts clicked fragment with insert options', () => {
      const result = renderDialog({libraries: [elementsFragmentLibrary()]});

      showLibraryTab(result);
      fireEvent.click(within(result.getByRole('tabpanel')).getByRole('button', {name: /Pull quote/}));

      expect(result.entry.insertContentElementFragment).toHaveBeenCalledWith(
        expect.objectContaining({attributes: expect.objectContaining({chapterPermaId: 100})}),
        {at: 'after', id: 1}
      );
    });

    it('reports error when inserting fragment fails', async () => {
      const result = renderDialog({libraries: [elementsFragmentLibrary()]});
      result.entry.insertContentElementFragment = () => Promise.reject(new Error());
      const errors = [];
      app.on('error', error => errors.push(error.message));

      showLibraryTab(result);
      fireEvent.click(within(result.getByRole('tabpanel')).getByRole('button', {name: /Pull quote/}));
      await new Promise(resolve => setTimeout(resolve));

      expect(errors).toEqual(['Could not insert.']);
      app.off('error');
    });

    it('closes after fragment has been clicked', () => {
      const result = renderDialog({libraries: [elementsFragmentLibrary()]});
      const close = jest.spyOn(result.view, 'close');

      showLibraryTab(result);
      fireEvent.click(within(result.getByRole('tabpanel')).getByRole('button', {name: /Pull quote/}));

      expect(close).toHaveBeenCalled();
    });

    it('renders fragments with appearance of section they are inserted into', () => {
      const seed = jest.spyOn(Fragment.prototype, 'seed');
      const result = renderDialog({libraries: [elementsFragmentLibrary()]});

      showLibraryTab(result);

      expect(seed).toHaveBeenCalledWith(expect.anything(),
                                        {section: result.entry.sections.get(5)});
      seed.mockRestore();
    });

    it('disables fragments when inserting in backdrop', () => {
      const result = renderDialog({
        libraries: [elementsFragmentLibrary()],
        insertOptions: {at: 'backdropOfSection', id: 10}
      });

      showLibraryTab(result);

      expect(within(result.getByRole('tabpanel')).getByRole('button', {name: /Pull quote/}))
        .toBeDisabled();
    });

    it('falls back to placeholder title for unnamed fragment', () => {
      const result = renderDialog({
        libraries: [library(
          [{id: 1, permaId: 100, configuration: {fragment: {kind: 'contentElements'}}}],
          [{id: 10, permaId: 1000, chapterId: 1, configuration: {}}],
          []
        )]
      });

      showLibraryTab(result);

      expect(within(result.getByRole('tabpanel')).getByText('Untitled fragment')).toBeTruthy();
    });

    it('renders blank slate without fragments', () => {
      const result = renderDialog();

      showLibraryTab(result);

      expect(within(result.getByRole('tabpanel')).getByText('No fragments yet.')).toBeTruthy();
    });

    it('reports failure to load libraries and retries when tab is shown again', () => {
      const result = renderDialog();
      testContext.server.respondWith('GET', /fragment_libraries/, [500, {}, '']);

      showLibraryTab(result);

      expect(within(result.getByRole('tabpanel')).getByRole('alert'))
        .toHaveTextContent('Could not load.');

      testContext.server.respondWith(
        'GET', /fragment_libraries/, [200, {'Content-Type': 'application/json'}, '[]']
      );
      fireEvent.click(result.getByRole('tab', {name: 'New element'}));
      showLibraryTab(result);

      expect(testContext.requests).toHaveLength(2);
      expect(within(result.getByRole('tabpanel')).getByText('No fragments yet.')).toBeTruthy();
    });

    it('loads libraries only once when switching tabs', () => {
      const result = renderDialog();

      showLibraryTab(result);
      fireEvent.click(result.getByRole('tab', {name: 'New element'}));
      showLibraryTab(result);

      expect(testContext.requests).toHaveLength(1);
    });
  });

  function disabledTypeNames(view) {
    return view.$el.find('li li button[disabled] span').map(function() { return $(this).text() }).get();
  }

  function availableTypeNames(view) {
    return view.$el.find('li li button:not([disabled]) span').map(function() { return $(this).text() }).get();
  }

  function availableCategories(view) {
    return view.$el.find('li h2').map(function() { return $(this).text() }).get();
  }
});
