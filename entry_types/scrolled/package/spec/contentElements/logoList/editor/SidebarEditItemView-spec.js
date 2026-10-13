import {SidebarEditItemView} from 'contentElements/logoList/editor/SidebarEditItemView';
import {ItemsCollection} from 'contentElements/logoList/editor/models/ItemsCollection';

import schema from 'contentElements/logoList/schema.json';

import {useConfigurationEditorMatchers} from 'pageflow-scrolled/testHelpers';
import {editor} from 'pageflow/editor';
import {DropDownButton} from 'pageflow/testHelpers';
import {useEditorGlobals, useFakeXhr} from 'support';

describe('logoList SidebarEditItemView', () => {
  useFakeXhr();
  useConfigurationEditorMatchers();

  const {createEntry} = useEditorGlobals();

  beforeEach(() => {
    editor.router = {navigate: jest.fn()};
  });

  function renderView() {
    const entry = createEntry({
      contentElements: [{
        id: 1,
        typeName: 'logoList',
        configuration: {items: [{id: 1}, {id: 2}]}
      }]
    });
    const contentElement = entry.contentElements.get(1);
    const items = ItemsCollection.forContentElement(contentElement, entry);
    const view = new SidebarEditItemView({
      model: items.get(1),
      collection: items,
      entry,
      contentElement
    });

    return {view, items};
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

  it('renders inputs described by schema', () => {
    const {view} = renderView();

    expect(() => view.render()).toRenderInputsMatching(schema, {path: ['items', '*']});
  });
});
