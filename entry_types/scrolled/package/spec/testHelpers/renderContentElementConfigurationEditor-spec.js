import {editor} from 'pageflow-scrolled/editor';
import {renderContentElementConfigurationEditor} from 'pageflow-scrolled/testHelpers';
import {TextInputView} from 'pageflow/ui';
import {useFakeTranslations} from 'pageflow/testHelpers';
import {useEditorGlobals} from 'support';
import '@testing-library/jest-dom/extend-expect';

editor.contentElementTypes.register('probe', {
  configurationEditor() {
    this.tab('general', function() {
      this.input('caption', TextInputView);
    });
  }
});

describe('renderContentElementConfigurationEditor', () => {
  const {createEntry} = useEditorGlobals();

  useFakeTranslations({
    'pageflow_scrolled.editor.content_elements.probe.attributes.caption.label': 'Caption'
  });

  it('returns queries bound to configuration editor', () => {
    const {getByRole} = render();

    expect(getByRole('textbox', {name: 'Caption'})).not.toBeNull();
  });

  function render() {
    const entry = createEntry({
      contentElements: [{id: 1, typeName: 'probe'}]
    });

    return renderContentElementConfigurationEditor({
      entry,
      contentElement: entry.contentElements.get(1)
    });
  }
});
