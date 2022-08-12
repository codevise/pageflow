import {InsertContentElementDialogView} from 'editor/views/InsertContentElementDialogView';
import {ScrolledEntry} from 'editor/models/ScrolledEntry';

import {factories, normalizeSeed} from 'support';
import {useFakeTranslations} from 'pageflow/testHelpers';

import $ from 'jquery';

describe('InsertContentElementDialogView', () => {
  useFakeTranslations({
    'pageflow_scrolled.editor.content_elements.textBlock.name': 'Text block',
    'pageflow_scrolled.editor.content_elements.inlineImage.name': 'Inline image'
  });

  it('renders list of content element types', () => {
    const editor = factories.editorApi();
    editor.contentElementTypes.register('textBlock');
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

  function availableTypeNames(view) {
    return view.$el.find('li button').map(function() { return $(this).text() }).get();
  }
});
