import _ from 'underscore';
import {AdjacentPages} from './AdjacentPages';
import Object from '../Object'


export const SuccessorPreparer = Object.extend({
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

SuccessorPreparer.create = function(pages, scrollNavigator) {
  return new SuccessorPreparer(
    new AdjacentPages(
      pages,
      scrollNavigator
    )
  );
};
