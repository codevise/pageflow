import {SidebarEditItemView} from 'contentElements/logoList/editor/SidebarEditItemView';
import {ItemsCollection} from 'contentElements/logoList/editor/models/ItemsCollection';

import schema from 'contentElements/logoList/schema.json';

import {useConfigurationEditorMatchers} from 'pageflow-scrolled/testHelpers';
import {editor} from 'pageflow/editor';
import {DropDownButton} from 'pageflow/testHelpers';
import {useEditorGlobals, useFakeXhr} from 'support';
import {getByPlaceholderText} from '@testing-library/dom';

describe('logoList SidebarEditItemView', () => {
  useFakeXhr();
  useConfigurationEditorMatchers();

  const {createEntry} = useEditorGlobals();

  beforeEach(() => {
    editor.router = {navigate: jest.fn()};
  });

  function renderView({itemId = 1} = {}) {
    const entry = createEntry({
      imageFiles: [{perma_id: 100, configuration: {alt: 'ACME Inc.'}}],
      contentElements: [{
        id: 1,
        typeName: 'logoList',
        configuration: {items: [{id: 1}, {id: 2, image: 100}]}
      }]
    });
    entry.imageFiles = entry.getFileCollection('image_files');
    const contentElement = entry.contentElements.get(1);
    const items = ItemsCollection.forContentElement(contentElement, entry);
    const view = new SidebarEditItemView({
      model: items.get(itemId),
      collection: items,
      entry,
      contentElement
    });

    return {view, items, entry};
  }

  it('removes item when destroy is confirmed', () => {
    const {view, items} = renderView();
    window.confirm = jest.fn(() => true);

    view.render();
    DropDownButton.find(view).selectMenuItemByName('destroy');

    expect(items.pluck('id')).toEqual([2]);
    expect(editor.router.navigate).toHaveBeenCalledWith(
      '/scrolled/content_elements/1', {trigger: true}
    );
  });

  it('displays alt text of image file as placeholder', () => {
    const {view} = renderView({itemId: 2});

    view.render();

    expect(getByPlaceholderText(view.el, 'ACME Inc.')).not.toBeNull();
  });

  it('updates placeholder when alt text of image file changes', () => {
    const {view, entry} = renderView({itemId: 2});

    view.render();
    entry.imageFiles.getByPermaId(100).configuration.set('alt', 'ACME');

    expect(getByPlaceholderText(view.el, 'ACME')).not.toBeNull();
  });

  it('renders inputs described by schema', () => {
    const {view} = renderView();

    expect(() => view.render()).toRenderInputsMatching(schema, {path: ['items', '*']});
  });
});
