import {SidebarEditLinkView} from './SidebarEditLinkView';
import {ExternalLinkCollection} from './models/ExternalLinkCollection';
import Marionette from 'backbone.marionette';

export const SidebarController = Marionette.Controller.extend({
  initialize: function(options) {
    this.entry = options.entry;
    this.region = options.region;
  },

  link: function(id, linkId) {
    const contentElement = this.entry.contentElements.get(id);
    const linksCollection = ExternalLinkCollection.forContentElement(contentElement, this.entry);

    this.region.show(new SidebarEditLinkView({
      model: linksCollection.get(linkId),
      collection: linksCollection,
      contentElement
    }));
  }
});
