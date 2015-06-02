//= require ./adjacent_pages

pageflow.AdjacentPreparer = pageflow.Object.extend({
  initialize: function(adjacentPages) {
    this.adjacentPages = adjacentPages;
  },

  attach: function(events) {
    this.listenTo(events, 'page:change', this.schedule);
  },

  schedule: function(page) {
    clearTimeout(this.scheduleTimeout);

    var prepare = _.bind(this.prepareAdjacent, this, page.element.page('instance'));
    this.scheduleTimeout = setTimeout(prepare, page.prepareNextPageTimeout());
  },

  prepareAdjacent: function(page) {
    var adjacentPages = this.adjacentPages.of(page);
    var noLongerAdjacentPages = _.difference(this.lastAdjacentPages, adjacentPages, [page]);
    var newAdjacentPages = _.difference(adjacentPages, this.lastAdjacentPages);

    _(noLongerAdjacentPages).each(function(page) {
      page.unprepare();
    });

    _(newAdjacentPages).each(function(adjacentPage) {
      adjacentPage.prepare();
      adjacentPage.preload();
    });

    this.lastAdjacentPages = adjacentPages;
  }
});

pageflow.AdjacentPreparer.create = function(pages, scrollNavigator) {
  return new pageflow.AdjacentPreparer(
    new pageflow.AdjacentPages(
      pages,
      scrollNavigator
    )
  );
};