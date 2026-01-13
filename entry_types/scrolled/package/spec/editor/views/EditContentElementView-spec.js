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
});
