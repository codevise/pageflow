pageflow.DomOrderScrollNavigator = function(slideshow) {
  this.getLandingPage = function(pages) {
    return pages.first();
  };

  this.back = function(currentPage) {
    slideshow.goTo(currentPage.prev('.page'), {position: 'bottom'});
  };

  this.next = function(currentPage) {
    slideshow.goTo(currentPage.next('.page'));
  };

  this.nextPageExists = function(currentPage, pages) {
    return !currentPage.is(pages.last());
  };

  this.previousPageExists = function(currentPage, pages) {
    return !currentPage.is(pages.first());
  };

  this.getNextPage = function(currentPage, pages) {
    return currentPage.next('.page');
  };

  this.getTransitionDirection = function(previousPage, currentPage, options) {
    return (currentPage.index() > previousPage.index() ? 'forwards' : 'backwards');
  };
};
