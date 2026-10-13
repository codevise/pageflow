import I18n from 'i18n-js';

import {editor} from 'pageflow-scrolled/editor';

import {ItemsListView} from './ItemsListView';
import {ItemsCollection} from './models/ItemsCollection';

import {SidebarRouter} from './SidebarRouter';
import {SidebarController} from './SidebarController';

import pictogram from './pictogram.svg';

editor.registerSideBarRouting({
  router: SidebarRouter,
  controller: SidebarController
});

editor.contentElementTypes.register('logoList', {
  pictogram,
  category: 'tilesAndLinks',
  featureName: 'logo_list_content_element',
  supportedPositions: ['inline'],
  supportedWidthRange: ['md', 'full'],

  editorPath(contentElement) {
    const selectedItemId = contentElement.transientState.get('selectedItemId');

    if (selectedItemId) {
      return `/scrolled/logoLists/${contentElement.id}/${selectedItemId}`;
    }
  },

  configurationPlace(contentElement, path) {
    const [propertyName, index, itemProperty] = path;

    if (propertyName !== 'items') {
      return;
    }

    const item = contentElement.configuration.get('items')[index];

    return {
      label: attributeLabel(itemProperty),

      select() {
        contentElement.postCommand({type: 'SET_SELECTED_ITEM', index: Number(index)});
        contentElement.select({navigate: false});

        editor.navigate(`/scrolled/logoLists/${contentElement.id}/${item.id}`,
                        {trigger: true});
      }
    };
  },

  configurationEditor({entry, contentElement}) {
    this.tab('general', function() {
      this.view(ItemsListView, {
        contentElement,
        collection: ItemsCollection.forContentElement(this.model.parent, entry)
      });
      this.group('ContentElementPosition', {entry});
    });
  }
});

editor.registerFileSelectionHandler('logoListItem', function(options) {
  const contentElement = options.entry.contentElements.get(options.contentElementId);
  const items = ItemsCollection.forContentElement(contentElement, options.entry);

  this.call = function(file) {
    items.get(options.id).setReference(options.attributeName, file);
  };

  this.getReferer = function() {
    return '/scrolled/logoLists/' + contentElement.id + '/' + options.id;
  };
});

function attributeLabel(propertyName) {
  return I18n.t(`${propertyName}.label`, {
    scope: 'pageflow_scrolled.editor.content_elements.logoList.edit_item.attributes'
  });
}
