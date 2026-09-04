import {ItemsListView} from 'contentElements/imageGallery/editor/ItemsListView';
import {ItemsCollection} from 'contentElements/imageGallery/editor/models/ItemsCollection';

import {editor} from 'pageflow/editor';
import {renderBackboneView as render} from 'pageflow/testHelpers';
import {useEditorGlobals, useFakeXhr} from 'support';

describe('ItemsListView', () => {
  useFakeXhr();

  const {createEntry} = useEditorGlobals();

  beforeEach(() => {
    editor.router = {navigate: jest.fn()};
  });

  function setup() {
    const entry = createEntry({
      imageFiles: [{perma_id: 100}],
      contentElements: [{id: 5, typeName: 'imageGallery',
                         configuration: {items: [{id: 7, image: 100}, {id: 8, image: 100}]}}]
    });
    const contentElement = entry.contentElements.get(5);

    entry.imageFiles = entry.getFileCollection('image_files');

    const view = new ItemsListView({
      contentElement,
      collection: ItemsCollection.forContentElement(contentElement, entry)
    });

    render(view);

    return {contentElement, view};
  }

  it('switches the gallery to the item being edited', () => {
    const {contentElement, view} = setup();
    const listener = jest.fn();
    contentElement.on('postCommand', listener);

    view.el.querySelectorAll('.list_item_edit_button')[1].click();

    expect(listener).toHaveBeenCalledWith(5, {type: 'SET_CURRENT_ITEM', index: 1});
    expect(editor.router.navigate)
      .toHaveBeenCalledWith('/scrolled/imageGalleries/5/8', {trigger: true});
  });
});
