import {SidebarEditLinkView} from 'contentElements/externalLinkList/editor/SidebarEditLinkView';
import {ExternalLinkCollection} from 'contentElements/externalLinkList/editor/models/ExternalLinkCollection';

import schema from 'contentElements/externalLinkList/schema.json';

import {useConfigurationEditorMatchers} from 'pageflow-scrolled/testHelpers';
import {editor} from 'pageflow/editor';
import {DropDownButton} from 'pageflow/testHelpers';
import {useEditorGlobals, useFakeXhr} from 'support';

describe('SidebarEditLinkView', () => {
  useFakeXhr();
  useConfigurationEditorMatchers();

  const {createEntry} = useEditorGlobals();

  beforeEach(() => {
    editor.router = {navigate: jest.fn()};
  });

  describe('destroy action', () => {
    it('removes model from collection when confirmed', () => {
      const entry = createEntry({
        contentElements: [
          {
            id: 1,
            typeName: 'externalLinkList',
            configuration: {
              links: [{id: 1}, {id: 2}]
            }
          }
        ]
      });
      const contentElement = entry.contentElements.get(1);
      const links = ExternalLinkCollection.forContentElement(contentElement, entry);
      const view = new SidebarEditLinkView({
        model: links.get(1),
        collection: links,
        entry,
        contentElement
      });
      window.confirm = jest.fn(() => true);

      view.render();
      DropDownButton.find(view).selectMenuItemByName('destroy');

      expect(links.length).toBe(1);
      expect(links.get(1)).toBeUndefined();
    });

    it('navigates back to content element when confirmed', () => {
      const entry = createEntry({
        contentElements: [
          {
            id: 1,
            typeName: 'externalLinkList',
            configuration: {
              links: [{id: 1}, {id: 2}]
            }
          }
        ]
      });
      const contentElement = entry.contentElements.get(1);
      const links = ExternalLinkCollection.forContentElement(contentElement, entry);
      const view = new SidebarEditLinkView({
        model: links.get(1),
        collection: links,
        entry,
        contentElement
      });
      window.confirm = jest.fn(() => true);

      view.render();
      DropDownButton.find(view).selectMenuItemByName('destroy');

      expect(editor.router.navigate).toHaveBeenCalledWith(
        '/scrolled/content_elements/1', {trigger: true}
      );
    });
  });

  describe('goBack', () => {
    it('posts command to deselect item', () => {
      const entry = createEntry({
        contentElements: [
          {
            id: 1,
            typeName: 'externalLinkList',
            configuration: {
              links: [{id: 1}]
            }
          }
        ]
      });
      const contentElement = entry.contentElements.get(1);
      const links = ExternalLinkCollection.forContentElement(contentElement, entry);
      const view = new SidebarEditLinkView({
        model: links.get(1),
        collection: links,
        entry,
        contentElement
      });
      contentElement.postCommand = jest.fn();

      view.render();
      view.goBack();

      expect(contentElement.postCommand).toHaveBeenCalledWith({
        type: 'SET_SELECTED_ITEM',
        index: -1
      });
    });
  });

  it('renders inputs described by schema', () => {
    const entry = createEntry({
      contentElements: [
        {
          id: 1,
          typeName: 'externalLinkList',
          configuration: {
            links: [{id: 1}]
          }
        }
      ]
    });
    const contentElement = entry.contentElements.get(1);
    const links = ExternalLinkCollection.forContentElement(contentElement, entry);
    const view = new SidebarEditLinkView({
      model: links.get(1),
      collection: links,
      entry,
      contentElement
    });

    expect(() => view.render()).toRenderInputsMatching(schema, {path: ['links', '*']});
  });
});
