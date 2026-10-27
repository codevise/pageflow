import {EditContentElementView} from 'editor/views/EditContentElementView';
import {ScrolledEntry} from 'editor/models/ScrolledEntry';
import {TextInputView} from 'pageflow/ui';
import {editor} from 'pageflow-scrolled/editor';

import {ExtractFragmentDialogView} from 'editor/views/ExtractFragmentDialogView';

import {ConfigurationEditor, useFakeFeatures, useFakeTranslations} from 'pageflow/testHelpers';
import {factories, normalizeSeed, useEditorGlobals, useFakeXhr} from 'support';

describe('EditContentElementView', () => {
  it('renders configuration editor for content element', () => {
    const editor = factories.editorApi();
    const entry = factories.entry(ScrolledEntry, {}, {
      entryTypeSeed: normalizeSeed({
        contentElements: [
          {id: 1, typeName: 'textBlock'}
        ]
      })
    });
    const view = new EditContentElementView({
      model: entry.contentElements.get(1),
      editor,
      entry
    });

    editor.contentElementTypes.register('textBlock', {
      configurationEditor() {
        this.tab('general', function() {
          this.input('text', TextInputView);
        });
      }
    });
    view.render();

    const configurationEditor = ConfigurationEditor.find(view);

    expect(configurationEditor.tabNames()).toContain('general');
    expect(configurationEditor.inputPropertyNames()).toContain('text');
  });

  it('passes entry and contentElement to configurationEditor method', () => {
    const editor = factories.editorApi();
    const entry = factories.entry(ScrolledEntry, {}, {
      entryTypeSeed: normalizeSeed({
        contentElements: [
          {id: 1, typeName: 'textBlock'}
        ]
      })
    });
    const contentElement = entry.contentElements.get(1);
    const view = new EditContentElementView({
      model: contentElement,
      editor,
      entry
    });
    const configurationEditorMethod = jest.fn().mockImplementation(function() {
      this.tab('general', () => {});
    });

    editor.contentElementTypes.register('textBlock', {
      configurationEditor: configurationEditorMethod
    });
    view.render();

    expect(configurationEditorMethod).toHaveBeenCalledWith({
      entry,
      contentElement: contentElement
    });
  });

  describe('actions menu', () => {
    const {createEntry} = useEditorGlobals();

    useFakeTranslations({
      'pageflow_scrolled.editor.extract_content_elements_fragment_menu_item.label':
        'Add to shared fragments'
    });

    function createView() {
      const entry = createEntry({contentElements: [{id: 1, typeName: 'textBlock'}]});
      editor.contentElementTypes.register('textBlock', {});

      return new EditContentElementView({
        model: entry.contentElements.get(1),
        editor,
        entry
      });
    }

    it('does not offer adding content element to shared fragments without fragments feature', () => {
      const view = createView();

      expect(view.getActionsMenuItems().map(item => item.get('label')))
        .not.toContain('Add to shared fragments');
    });

    describe('with fragments feature', () => {
      useFakeFeatures('editor', ['fragments']);

      afterEach(() => jest.restoreAllMocks());

      it('offers adding content element to shared fragments', () => {
        jest.spyOn(ExtractFragmentDialogView, 'show').mockImplementation(() => {});
        const view = createView();
        view.options.entry.extractContentElementsToFragmentLibrary =
          jest.fn(() => new Promise(() => {}));

        view.getActionsMenuItems()
          .find(item => item.get('label') === 'Add to shared fragments')
          .selected();
        ExtractFragmentDialogView.show.mock.calls[0][0].onSubmit('Quote');

        expect(view.options.entry.extractContentElementsToFragmentLibrary)
          .toHaveBeenCalledWith([{id: 1}], {title: 'Quote'});
      });
    });
  });

  describe('back navigation', () => {
    let testContext;

    beforeEach(() => {
      testContext = {};
    });

    useFakeXhr(() => testContext);
    const {createEntry} = useEditorGlobals();

    beforeEach(() => {
      editor.router = {navigate: jest.fn()};
      editor.contentElementTypes.register('inlineImage', {
        configurationEditor() {
          this.tab('general', () => {});
        }
      });
    });

    it('navigates to outline when content element is deleted', () => {
      const entry = createEntryWithContentElementInEachSection();
      renderView(entry);

      entry.deleteContentElement(entry.contentElements.get(5));
      testContext.server.respond([200, {'Content-Type': 'application/json'}, '[]']);

      expect(editor.router.navigate).toHaveBeenCalledWith('/', {trigger: true});
    });

    it('does not navigate when content element is moved to other section', () => {
      const entry = createEntryWithContentElementInEachSection();
      renderView(entry);

      entry.moveContentElement({id: 5}, {id: 6, at: 'before'});
      testContext.server.respond([
        200,
        {'Content-Type': 'application/json'},
        JSON.stringify([{id: 5}, {id: 6}])
      ]);

      expect(entry.contentElements.get(5).section.id).toBe(11);
      expect(editor.router.navigate).not.toHaveBeenCalled();
    });

    function createEntryWithContentElementInEachSection() {
      return createEntry({
        sections: [{id: 10}, {id: 11}],
        contentElements: [
          {id: 5, sectionId: 10, typeName: 'inlineImage'},
          {id: 6, sectionId: 11, typeName: 'inlineImage'}
        ]
      });
    }

    function renderView(entry) {
      const view = new EditContentElementView({
        model: entry.contentElements.get(5),
        editor,
        entry
      });

      view.render();

      return view;
    }
  });
});
