pageflow.AdjacentPages = pageflow.Object.extend({
  initialize: function(pages, scrollNavigator) {
    this.pages = pages;
    this.scrollNavigator = scrollNavigator;
  },

  of: function(page) {
    var result = [];
    var pages = this.pages();
    var nextPage = this.scrollNavigator.getNextPage(page.element, pages);

    if (nextPage.length) {
      result.push(nextPage.page('instance'));
    }

    _(page.linkedPages()).each(function(permaId) {
      var linkedPage = pages.filter('#' + permaId);

      if (linkedPage.length) {
        result.push(linkedPage.page('instance'));
      }
    }, this);

    return result;
  }
});