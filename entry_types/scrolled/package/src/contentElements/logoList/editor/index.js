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
