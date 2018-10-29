//= require ./adjacent_pages

pageflow.SuccessorPreparer = pageflow.Object.extend({
  initialize: function(adjacentPages) {
    this.adjacentPages = adjacentPages;
  },

  attach: function(events) {
    this.listenTo(events, 'page:change', this.schedule);
  },

  schedule: function(page) {
    clearTimeout(this.scheduleTimeout);

    var prepare = _.bind(this.prepareSuccessor, this, page);
    this.scheduleTimeout = setTimeout(prepare, page.prepareNextPageTimeout());
  },

  prepareSuccessor: function(page) {
    var preparedPages = _.compact([
      page,
      this.adjacentPages.nextPage(page)
    ]);

    var noLongerPreparedPages = _.difference(this.lastPreparedPages, preparedPages);
    var newAdjacentPages = _.difference(preparedPages, this.lastPreparedPages);

    _(noLongerPreparedPages).each(function(page) {
      if (!page.isDestroyed) {
        page.unprepare();
      }
    });

    _(newAdjacentPages).each(function(adjacentPage) {
      adjacentPage.prepare();
    });

    this.lastPreparedPages = preparedPages;
  }
});

pageflow.SuccessorPreparer.create = function(pages, scrollNavigator) {
  return new pageflow.SuccessorPreparer(
    new pageflow.AdjacentPages(
      pages,
      scrollNavigator
    )
  );
};
