import {EditContentElementView} from 'editor/views/EditContentElementView';
import {ScrolledEntry} from 'editor/models/ScrolledEntry';
import {TextInputView} from 'pageflow/ui';

import {ConfigurationEditor} from 'pageflow/testHelpers';
import {factories, normalizeSeed} from 'support';

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

  it('passes entry to configurationEditor method', () => {
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

    expect(configurationEditorMethod).toHaveBeenCalledWith({entry});
  });

  it('lets content element types override detroy button', () => {
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
    const handleDestroy = jest.fn();
    entry.deleteContentElement = jest.fn();

    editor.contentElementTypes.register('textBlock', {
      configurationEditor() {
        this.tab('general', function() {});
      },

      handleDestroy
    });
    view.render();

    view.destroyModel();

    expect(handleDestroy).toHaveBeenCalledWith(contentElement);
  });

  it('does not call deleteContentElement if handleDestroy returns false', () => {
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
    entry.deleteContentElement = jest.fn();

    editor.contentElementTypes.register('textBlock', {
      configurationEditor() {
        this.tab('general', function() {});
      },

      handleDestroy() {
        return false;
      }
    });
    view.render();

    view.destroyModel();

    expect(entry.deleteContentElement).not.toHaveBeenCalled();
  });
});
