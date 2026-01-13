import {SidebarEditAreaView} from 'contentElements/hotspots/editor/SidebarEditAreaView';
import {AreasCollection} from 'contentElements/hotspots/editor/models/AreasCollection';

import {editor} from 'pageflow/editor';
import {ConfigurationEditor, DropDownButton, Tabs, renderBackboneView as render, useFakeTranslations} from 'pageflow/testHelpers';
import {useEditorGlobals, useFakeXhr} from 'support';
import userEvent from '@testing-library/user-event';

describe('SidebarEditAreaView', () => {
  useFakeXhr();
  const {createEntry} = useEditorGlobals();

  beforeEach(() => {
    editor.router = {navigate: jest.fn()};
  });

  useFakeTranslations({
    'pageflow_scrolled.editor.content_elements.hotspots.edit_area.tabs.area': 'Area',
    'pageflow_scrolled.editor.content_elements.hotspots.edit_area.tabs.portrait': 'Portrait'
  });

  describe('destroy action', () => {
    it('removes model from collection when confirmed', () => {
      const entry = createEntry({
        imageFiles: [{perma_id: 10}],
        contentElements: [
          {
            id: 1,
            typeName: 'hotspots',
            configuration: {
              image: 10,
              areas: [{id: 1}, {id: 2}]
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
      window.confirm = jest.fn(() => true);

      view.render();
      DropDownButton.find(view).selectMenuItemByName('destroy');

      expect(areas.length).toBe(1);
      expect(areas.get(1)).toBeUndefined();
    });

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

  it('renders zoom inputs if pan zoom is enabled', async () => {
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
            enablePanZoom: 'always',
            areas: [{id: 1, zoom: 0}]
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

    const user = userEvent.setup();
    const {getByText} = render(view);

    let configurationEditor = ConfigurationEditor.find(view);
    expect(configurationEditor.inputPropertyNames()).toContain('zoom');

    await user.click(getByText('Portrait'));
    configurationEditor = ConfigurationEditor.find(view);

    expect(configurationEditor.inputPropertyNames()).toContain('portraitZoom');
  });

  it('does not render zoom inputs if pan zoom is disabled', async () => {
    const entry = createEntry({
      imageFiles: [
        {perma_id: 10},
        {perma_id: 11},
      ],
      contentElements: [
        {
          id: 1,
          typeName: 'hotspots',
          configuration: {
            image: 10,
            portraitImage: 11,
            enablePanZoom: 'never',
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

    const user = userEvent.setup();
    const {getByText} = render(view);

    let configurationEditor = ConfigurationEditor.find(view);
    expect(configurationEditor.inputPropertyNames()).not.toContain('zoom');

    await user.click(getByText('Portrait'));
    configurationEditor = ConfigurationEditor.find(view);

    expect(configurationEditor.inputPropertyNames()).not.toContain('portraitZoom');
  });
});
