import {ItemsListView} from 'contentElements/logoList/editor/ItemsListView';
import {ItemsCollection} from 'contentElements/logoList/editor/models/ItemsCollection';

import {editor} from 'pageflow/editor';
import {renderBackboneView as render, useFakeTranslations} from 'pageflow/testHelpers';
import {useEditorGlobals, useFakeXhr} from 'support';
import {getAllByTitle} from '@testing-library/dom';

describe('logoList ItemsListView', () => {
  useFakeXhr();
  useFakeTranslations({
    'pageflow.editor.templates.list_item.edit': 'Edit'
  });

  const {createEntry} = useEditorGlobals();

  beforeEach(() => {
    editor.router = {navigate: jest.fn()};
  });

  function setup() {
    const entry = createEntry({
      imageFiles: [{perma_id: 100}],
      contentElements: [{id: 5, typeName: 'logoList',
                         configuration: {items: [{id: 7, image: 100}, {id: 8, image: 100}]}}]
    });
    const contentElement = entry.contentElements.get(5);

    entry.imageFiles = entry.getFileCollection('image_files');

    const view = new ItemsListView({
      contentElement,
      collection: ItemsCollection.forContentElement(contentElement, entry)
    });

    render(view);

    return {view, contentElement};
  }

  it('selects the item being edited in the preview', () => {
    const {view, contentElement} = setup();
    contentElement.postCommand = jest.fn();

    getAllByTitle(view.el, 'Edit')[1].click();

    expect(contentElement.postCommand)
      .toHaveBeenCalledWith({type: 'SET_SELECTED_ITEM', index: 1});
  });

  it('navigates to the item being edited', () => {
    const {view} = setup();

    getAllByTitle(view.el, 'Edit')[1].click();

    expect(editor.router.navigate)
      .toHaveBeenCalledWith('/scrolled/logoLists/5/8', {trigger: true});
  });
});
