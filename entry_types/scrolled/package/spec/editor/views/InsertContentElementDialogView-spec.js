import {InsertContentElementDialogView} from 'editor/views/InsertContentElementDialogView';
import {ScrolledEntry} from 'editor/models/ScrolledEntry';

import {factories, normalizeSeed} from 'support';
import {useFakeTranslations} from 'pageflow/testHelpers';

import $ from 'jquery';

describe('InsertContentElementDialogView', () => {
  useFakeTranslations({
    'pageflow_scrolled.editor.content_element_categories.basic.name': 'Basic',
    'pageflow_scrolled.editor.content_elements.textBlock.name': 'Text block',
    'pageflow_scrolled.editor.content_elements.inlineImage.name': 'Image',
    'pageflow_scrolled.editor.content_elements.inlineVideo.name': 'Video'
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
