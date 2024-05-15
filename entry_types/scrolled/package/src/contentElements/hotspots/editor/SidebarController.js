import {SidebarEditAreaView} from './SidebarEditAreaView';
import {AreasCollection} from './models/AreasCollection';
import Marionette from 'backbone.marionette';

export const SidebarController = Marionette.Controller.extend({
  initialize: function(options) {
    this.entry = options.entry;
    this.region = options.region;
  },

  area: function(id, areaId, tab) {
    const contentElement = this.entry.contentElements.get(id);
    const areasCollection = AreasCollection.forContentElement(contentElement, this.entry);

    this.region.show(new SidebarEditAreaView({
      model: areasCollection.get(areaId),
      collection: areasCollection,
      entry: this.entry,
      contentElement,
      tab
    }));
  }
});
