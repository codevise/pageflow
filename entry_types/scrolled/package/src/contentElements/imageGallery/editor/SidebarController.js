import {SidebarEditItemView} from './SidebarEditItemView';
import {ItemsCollection} from './models/ItemsCollection';
import Marionette from 'backbone.marionette';

export const SidebarController = Marionette.Controller.extend({
  initialize: function(options) {
    this.entry = options.entry;
    this.region = options.region;
  },

  item: function(id, itemId) {
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
