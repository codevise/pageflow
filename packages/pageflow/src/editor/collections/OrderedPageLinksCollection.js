import {PageLinksCollection} from './PageLinksCollection';

//= require ./page_links_collection

export const OrderedPageLinksCollection = PageLinksCollection.extend({
  comparator: 'position',

  saveOrder: function() {
    this.save();
  }
});