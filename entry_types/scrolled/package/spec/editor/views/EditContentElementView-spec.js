import {EditContentElementView} from 'editor/views/EditContentElementView';
import {ConfigurationEditor} from 'pageflow/testHelpers';
import {TextInputView} from 'pageflow/ui';
import {factories} from 'support';

describe('EditContentElementView', () => {
  it('renders configuration editor for content element', () => {
    const editor = factories.editorApi();
    const view = new EditContentElementView({
      model: factories.contentElement({
        typeName: 'textBlock'
      }),
      editor
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
});
