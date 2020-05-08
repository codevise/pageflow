import _ from 'underscore';
import Object from '../Object'

export const AdjacentPages = Object.extend({
  initialize: function(pages, scrollNavigator) {
    this.pages = pages;
    this.scrollNavigator = scrollNavigator;
  },

  of: function(page) {
    var result = [];
    var pages = this.pages();
    var nextPage = this.nextPage(page);

    if (nextPage) {
      result.push(nextPage);
    }

    _(page.linkedPages()).each(function(permaId) {
      var linkedPage = pages.filter('#' + permaId);

      if (linkedPage.length) {
        result.push(linkedPage.page('instance'));
      }
    }, this);

    return result;
  },

  nextPage: function(page) {
    var nextPage = this.scrollNavigator.getNextPage(page.element, this.pages());
    return nextPage.length && nextPage.page('instance');
  }
});
