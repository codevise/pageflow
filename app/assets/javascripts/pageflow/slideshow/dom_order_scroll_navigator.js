pageflow.DomOrderScrollNavigator = function(slideshow) {
  this.back = function(currentPage) {
    slideshow.goTo(currentPage.prev('.page'), {position: 'bottom'});
  };

  this.next = function(currentPage) {
    slideshow.goTo(currentPage.next('.page'));
  };

  this.getTransitionDirection = function(previousPage, currentPage, options) {
    return (currentPage.index() > previousPage.index() ? 'forwards' : 'backwards');
  };
};
