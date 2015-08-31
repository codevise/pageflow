pageflow.DomOrderScrollNavigator = function(slideshow, entryData) {
  this.getLandingPage = function(pages) {
    return pages.first();
  };

  this.back = function(currentPage, pages) {
    slideshow.goTo(this.getPreviousPage(currentPage, pages), {position: 'bottom'});
  };

  this.next = function(currentPage, pages) {
    slideshow.goTo(this.getNextPage(currentPage, pages));
  };

  this.nextPageExists = function(currentPage, pages) {
    return !!this.getNextPage(currentPage, pages).length;
  };

  this.previousPageExists = function(currentPage, pages) {
    return !!this.getPreviousPage(currentPage, pages).length;
  };

  this.getNextPage = function(currentPage, pages) {
    var nextPage = currentPage.next('.page');

    if (sameStoryline(currentPage, nextPage)) {
      return nextPage;
    }

    return getParentPage(currentPage, pages);
  };

  this.getPreviousPage = function(currentPage, pages) {
    var previousPage =  currentPage.prev('.page');

    if (sameStoryline(currentPage, previousPage)) {
      return previousPage;
    }

    return getParentPage(currentPage, pages);
  };

  this.getTransitionDirection = function(previousPage, currentPage, options) {
    return (currentPage.index() > previousPage.index() ? 'forwards' : 'backwards');
  };

  function sameStoryline(page1, page2) {
    return entryData.getStorylineIdByPagePermaId(page1.page('getPermaId')) ==
      entryData.getStorylineIdByPagePermaId(page2.page('getPermaId'));
  }

  function getParentPage(page, pages) {
    var permaId = page.page('getPermaId');
    var storylineId = entryData.getStorylineIdByPagePermaId(permaId);
    var storylineConfiguration = entryData.getStorylineConfiguration(storylineId);

    if ('parent_page_perma_id' in storylineConfiguration) {
      return pages.filter('#' + storylineConfiguration.parent_page_perma_id);
    }

    return $();
  }
};
