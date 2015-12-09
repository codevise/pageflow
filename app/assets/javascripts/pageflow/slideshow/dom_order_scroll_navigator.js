pageflow.DomOrderScrollNavigator = function(slideshow, entryData) {
  this.getLandingPage = function(pages) {
    return pages.first();
  };

  this.back = function(currentPage, pages) {
    var forcedTransition = null;
    var previousPage = this.getPreviousPage(currentPage, pages);

    if (previousPage.is(getParentPage(currentPage, pages))) {
      forcedTransition = 'scroll_over_from_right';
    }

    slideshow.goTo(previousPage, {
      position: forcedTransition ? null :'bottom',
      transition: forcedTransition
    });
  };

  this.next = function(currentPage, pages) {
    var forcedTransition = null;
    var nextPage = this.getNextPage(currentPage, pages);

    if (nextPage.is(getParentPage(currentPage, pages))) {
      forcedTransition = 'scroll_over_from_right';
    }

    slideshow.goTo(nextPage, {transition: forcedTransition});
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

    var scrollSuccessor = getScrollSuccessor(currentPage, pages);

    if (scrollSuccessor.length) {
      return scrollSuccessor;
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
    var storylineConfiguration = getStorylineConfiguration(page);

    if ('parent_page_perma_id' in storylineConfiguration &&
        entryData.getThemingOption('change_to_parent_page_at_storyline_boundary')) {

      return pages.filter('#' + storylineConfiguration.parent_page_perma_id);
    }

    return $();
  }

  function getScrollSuccessor(page, pages) {
    var storylineConfiguration = getStorylineConfiguration(page);

    if ('scroll_successor_id' in storylineConfiguration) {
      return pages.filter('#' + storylineConfiguration.scroll_successor_id);
    }

    return $();
  }

  function getStorylineConfiguration(page) {
    var permaId = page.page('getPermaId');
    var storylineId = entryData.getStorylineIdByPagePermaId(permaId);
    return entryData.getStorylineConfiguration(storylineId);
  }
};
