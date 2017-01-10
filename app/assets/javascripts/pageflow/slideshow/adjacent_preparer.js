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
    var noLongerPreparedPages = _.difference(this.lastPreparedPages, adjacentPages, [page]);
    var newAdjacentPages = _.difference(adjacentPages, this.lastPreparedPages);

    _(noLongerPreparedPages).each(function(page) {
      if (!page.isDestroyed) {
        page.unprepare();
      }
    });

    _(newAdjacentPages).each(function(adjacentPage) {
      adjacentPage.prepare();
      adjacentPage.preload();
    });

    this.lastPreparedPages = adjacentPages.concat([page]);
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