import 'contentElements/logoList/editor';

import {editor} from 'pageflow/editor';

import {useFakeTranslations} from 'pageflow/testHelpers';
import {useEditorGlobals} from 'support';

describe('logoList configuration place', () => {
  useFakeTranslations({
    'pageflow_scrolled.editor.configuration_places.label': '%{chapter} - %{subject}',
    'pageflow_scrolled.editor.content_elements.logoList.name': 'Logo List',
    'pageflow_scrolled.editor.content_elements.logoList.edit_item.attributes.image.label':
      'Image'
  });

  const {createEntry} = useEditorGlobals();

  beforeEach(() => {
    editor.router = {navigate: jest.fn()};
  });

  function create(configuration) {
    return createEntry({
      chapters: [{id: 1, permaId: 100, configuration: {title: 'Intro'}}],
      imageFiles: [{perma_id: 5}],
      sections: [{id: 1, permaId: 10, chapterId: 1}],
      contentElements: [{id: 2, permaId: 20, sectionId: 1, typeName: 'logoList',
                         configuration}],
      fileReferenceLocations: {
        contentElements: {
          logoList: [{path: ['items', '*', 'image'], collection: 'imageFiles'}]
        }
      }
    });
  }

  function places(entry) {
    return entry.fileReferences().placesFor(
      entry.getFileCollection('image_files').findWhere({perma_id: 5})
    );
  }

  it('names the referencing property of an item', () => {
    const entry = create({items: [{id: 7}, {id: 8, image: 5}]});

    expect(places(entry).map(({label, detail}) => [label, detail]))
      .toEqual([['Intro - Logo List', 'Image']]);
  });

  it('opens the editor of the item on select', () => {
    const entry = create({items: [{id: 7}, {id: 8, image: 5}]});

    places(entry)[0].select();

    expect(editor.router.navigate)
      .toHaveBeenCalledWith('/scrolled/logoLists/2/8', {trigger: true});
  });

  it('marks the item in the preview on select', () => {
    const entry = create({items: [{id: 7}, {id: 8, image: 5}]});
    const listener = jest.fn();
    entry.contentElements.get(2).on('postCommand', listener);

    places(entry)[0].select();

    expect(listener).toHaveBeenCalledWith(2, {type: 'SET_SELECTED_ITEM', index: 1});
  });

  it('selects the content element without leaving the item route', () => {
    const entry = create({items: [{id: 7}, {id: 8, image: 5}]});
    const listener = jest.fn();
    entry.on('selectContentElement', listener);

    places(entry)[0].select();

    expect(listener).toHaveBeenCalledWith(entry.contentElements.get(2), {navigate: false});
  });
});
