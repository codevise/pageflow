//= require ./adjacent_pages

pageflow.AdjacentPreloader = pageflow.Object.extend({
  initialize: function(adjacentPages) {
    this.adjacentPages = adjacentPages;
  },

  attach: function(events) {
    this.listenTo(events, 'page:change', this.preloadAdjacent);
  },

  preloadAdjacent: function(page) {
    _(this.adjacentPages.of(page)).each(function(page) {
      page.preload();
    });
  }
});

pageflow.AdjacentPreloader.create = function(pages, scrollNavigator) {
  return new pageflow.AdjacentPreloader(
    new pageflow.AdjacentPages(
      pages,
      scrollNavigator
    )
  );
};
