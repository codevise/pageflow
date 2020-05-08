import _ from 'underscore';
import {AdjacentPages} from './AdjacentPages';
import Object from '../Object'

export const AdjacentPreloader = Object.extend({
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

AdjacentPreloader.create = function(pages, scrollNavigator) {
  return new AdjacentPreloader(
    new AdjacentPages(
      pages,
      scrollNavigator
    )
  );
};
