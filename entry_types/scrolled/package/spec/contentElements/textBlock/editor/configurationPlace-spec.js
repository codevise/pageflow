import 'contentElements/textBlock/editor';

import {useFakeTranslations} from 'pageflow/testHelpers';
import {useEditorGlobals} from 'support';

describe('textBlock configuration place', () => {
  useFakeTranslations({
    'pageflow_scrolled.editor.configuration_places.label': '%{chapter} - %{subject}',
    'pageflow_scrolled.editor.content_elements.textBlock.name': 'Text',
    'pageflow_scrolled.editor.content_elements.textBlock.configuration_places.link':
      'Link "%{text}"'
  });

  const {createEntry} = useEditorGlobals();

  function create(value) {
    return createEntry({
      chapters: [{id: 1, permaId: 100, configuration: {title: 'Intro'}}],
      imageFiles: [{perma_id: 5}],
      sections: [{id: 1, permaId: 10, chapterId: 1}],
      contentElements: [{id: 2, permaId: 20, sectionId: 1, typeName: 'textBlock',
                         configuration: {value}}]
    });
  }

  function places(entry) {
    return entry.fileReferences().placesFor(
      entry.getFileCollection('image_files').findWhere({perma_id: 5})
    );
  }

  it('names the link by its text', () => {
    const entry = create([
      {type: 'paragraph', children: [
        {text: 'Get the '},
        linkNode([{text: 'brochure'}, {text: ' now', bold: true}])
      ]}
    ]);

    expect(places(entry).map(({label, detail}) => [label, detail]))
      .toEqual([['Intro - Text', 'Link "brochure now"']]);
  });

  it('selects the block containing the link on select', () => {
    const entry = create([
      {type: 'paragraph', children: [{text: 'Intro'}]},
      {type: 'paragraph', children: [linkNode([{text: 'brochure'}])]}
    ]);
    const listener = jest.fn();
    entry.on('selectContentElement', listener);

    places(entry)[0].select();

    expect(listener).toHaveBeenCalledWith(entry.contentElements.get(2),
                                          expect.objectContaining({range: [1, 2]}));
  });

  it('selects the top level block for links nested in lists', () => {
    const entry = create([
      {type: 'paragraph', children: [{text: 'Intro'}]},
      {type: 'paragraph', children: [{text: 'More'}]},
      {type: 'bulleted-list', children: [
        {type: 'list-item', children: [{text: 'Item'}]},
        {type: 'list-item', children: [linkNode([{text: 'brochure'}])]}
      ]}
    ]);
    const listener = jest.fn();
    entry.on('selectContentElement', listener);

    places(entry)[0].select();

    expect(places(entry)[0].detail).toEqual('Link "brochure"');
    expect(listener).toHaveBeenCalledWith(entry.contentElements.get(2),
                                          expect.objectContaining({range: [2, 3]}));
  });

  function linkNode(children) {
    return {
      type: 'link',
      href: {file: {permaId: 5, collectionName: 'imageFiles'}},
      children
    };
  }
});
