//= require ./page_links_collection

pageflow.OrderedPageLinksCollection = pageflow.PageLinksCollection.extend({
  comparator: 'position',

  saveOrder: function() {
    this.save();
  }
});