import Marionette from 'backbone.marionette';

import {SidebarEditItemView} from './SidebarEditItemView';
import {ItemsCollection} from './models/ItemsCollection';

export const SidebarController = Marionette.Controller.extend({
  initialize(options) {
    this.entry = options.entry;
    this.region = options.region;
  },

  item(id, itemId) {
    const contentElement = this.entry.contentElements.get(id);
    const itemsCollection = ItemsCollection.forContentElement(contentElement, this.entry);

    this.region.show(new SidebarEditItemView({
      model: itemsCollection.get(itemId),
      collection: itemsCollection,
      entry: this.entry,
      contentElement
    }));
  }
});
