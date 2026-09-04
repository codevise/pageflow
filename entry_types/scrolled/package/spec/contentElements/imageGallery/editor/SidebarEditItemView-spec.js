import {SidebarEditItemView} from 'contentElements/imageGallery/editor/SidebarEditItemView';
import {ItemsCollection} from 'contentElements/imageGallery/editor/models/ItemsCollection';

import schema from 'contentElements/imageGallery/schema.json';

import {useConfigurationEditorMatchers} from 'pageflow-scrolled/testHelpers';
import {useEditorGlobals} from 'support';

describe('SidebarEditItemView', () => {
  useConfigurationEditorMatchers();

  const {createEntry} = useEditorGlobals();

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
