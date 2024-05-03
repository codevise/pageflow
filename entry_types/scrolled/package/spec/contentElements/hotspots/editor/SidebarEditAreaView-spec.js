import {SidebarEditAreaView} from 'contentElements/hotspots/editor/SidebarEditAreaView';
import {AreasCollection} from 'contentElements/hotspots/editor/models/AreasCollection';

import {Tabs, useFakeTranslations} from 'pageflow/testHelpers';
import {useEditorGlobals} from 'support';

describe('SidebarEditAreaView', () => {
  const {createEntry} = useEditorGlobals();

  useFakeTranslations({
    'pageflow_scrolled.editor.content_elements.hotspots.edit_area.tabs.area': 'Area',
    'pageflow_scrolled.editor.content_elements.hotspots.edit_area.tabs.portrait': 'Portrait'
  });

  it('renders portrait tab if portrait image is present', () => {
    const entry = createEntry({
      imageFiles: [
        {perma_id: 10},
        {perma_id: 11}
      ],
      contentElements: [
        {
          id: 1,
          typeName: 'hotspots',
          configuration: {
            image: 10,
            portraitImage: 11,
            areas: [{id: 1}]
          }
        }
      ]
    });
    const contentElement = entry.contentElements.get(1);
    const areas = AreasCollection.forContentElement(contentElement);
    const view = new SidebarEditAreaView({
      model: areas.get(1),
      collection: areas,
      entry,
      contentElement
    });

    view.render();
    const tabs = Tabs.find(view);

    expect(tabs.tabLabels()).toEqual(['Area', 'Portrait']);
  });

  it('does not render portrait tab if portrait image is blank', () => {
    const entry = createEntry({
      imageFiles: [
        {perma_id: 10}
      ],
      contentElements: [
        {
          id: 1,
          typeName: 'hotspots',
          configuration: {
            image: 10,
            areas: [{id: 1}]
          }
        }
      ]
    });
    const contentElement = entry.contentElements.get(1);
    const areas = AreasCollection.forContentElement(contentElement);
    const view = new SidebarEditAreaView({
      model: areas.get(1),
      collection: areas,
      entry,
      contentElement
    });

    view.render();
    const tabs = Tabs.find(view);

    expect(tabs.tabLabels()).toEqual(['Area']);
  });
});
