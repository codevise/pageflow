import {SidebarEditItemView} from 'contentElements/imageGallery/editor/SidebarEditItemView';
import {ItemsCollection} from 'contentElements/imageGallery/editor/models/ItemsCollection';

import schema from 'contentElements/imageGallery/schema.json';

import {useConfigurationEditorMatchers} from 'pageflow-scrolled/testHelpers';
import {editor} from 'pageflow/editor';
import {DropDownButton} from 'pageflow/testHelpers';
import {useEditorGlobals, useFakeXhr} from 'support';

describe('SidebarEditItemView', () => {
  useFakeXhr();
  useConfigurationEditorMatchers();

  const {createEntry} = useEditorGlobals();

  beforeEach(() => {
    editor.router = {navigate: jest.fn()};
  });

  describe('destroy action', () => {
    it('removes model from collection when confirmed', () => {
      const {view, items} = renderView();
      window.confirm = jest.fn(() => true);

      DropDownButton.find(view).selectMenuItemByName('destroy');

      expect(items.length).toBe(1);
      expect(items.get(1)).toBeUndefined();
    });

    it('navigates back to content element when confirmed', () => {
      const {view} = renderView();
      window.confirm = jest.fn(() => true);

      DropDownButton.find(view).selectMenuItemByName('destroy');

      expect(editor.router.navigate).toHaveBeenCalledWith(
        '/scrolled/content_elements/1', {trigger: true}
      );
    });

    function renderView() {
      const entry = createEntry({
        contentElements: [
          {
            id: 1,
            typeName: 'imageGallery',
            configuration: {
              items: [{id: 1}, {id: 2}]
            }
          }
        ]
      });
      const contentElement = entry.contentElements.get(1);
      const items = ItemsCollection.forContentElement(contentElement, entry);
      const view = new SidebarEditItemView({
        model: items.get(1),
        collection: items,
        entry,
        contentElement
      });

      view.render();

      return {view, items};
    }
  });

  it('renders inputs described by schema', () => {
    const entry = createEntry({
      contentElements: [
        {
          id: 1,
          typeName: 'imageGallery',
          configuration: {
            items: [{id: 1}]
          }
        }
      ]
    });
    const contentElement = entry.contentElements.get(1);
    const items = ItemsCollection.forContentElement(contentElement, entry);
    const view = new SidebarEditItemView({
      model: items.get(1),
      collection: items,
      entry,
      contentElement
    });

    expect(() => view.render()).toRenderInputsMatching(schema, {path: ['items', '*']});
  });
});
