import {PageLinksCollection} from './PageLinksCollection';

export const OrderedPageLinksCollection = PageLinksCollection.extend({
  comparator: 'position',

  saveOrder: function() {
    this.save();
  }
});
