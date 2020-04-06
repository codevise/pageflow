import $ from 'jquery';

export const DomOrderScrollNavigator = function(slideshow, entryData) {
  this.getLandingPage = function(pages) {
    return pages.first();
  };

  this.back = function(currentPage, pages) {
    var position = 'bottom';
    var previousPage = this.getPreviousPage(currentPage, pages);

    if (previousPage.is(getParentPage(currentPage, pages))) {
      position = null;
    }

    slideshow.goTo(previousPage, {
      position: position,
      ignoreInHistory: true
    });
  };

  this.next = function(currentPage, pages) {
    slideshow.goTo(this.getNextPage(currentPage, pages), {
      ignoreInHistory: true
    });
  };

  this.nextPageExists = function(currentPage, pages) {
    return !!this.getNextPage(currentPage, pages).length;
  };

  this.previousPageExists = function(currentPage, pages) {
    return !!this.getPreviousPage(currentPage, pages).length;
  };

  this.getNextPage = function(currentPage, pages) {
    var currentPageIndex = pages.index(currentPage);
    var nextPage = currentPageIndex < pages.length - 1 ? $(pages.get(currentPageIndex + 1)) : $();

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
    var currentPageIndex = pages.index(currentPage);
    var previousPage = currentPageIndex > 0 ? $(pages.get(currentPageIndex - 1)) : $();

    if (sameStoryline(currentPage, previousPage)) {
      return previousPage;
    }

    return getParentPage(currentPage, pages);
  };

  this.getTransitionDirection = function(previousPage, currentPage, pages, options) {
    return (pages.index(currentPage) > pages.index(previousPage) ? 'forwards' : 'backwards');
  };

  this.getDefaultTransition = function(previousPage, currentPage, pages) {
    if (inParentStorylineOf(currentPage, previousPage, pages)) {
      return getStorylinePageTransition(currentPage);
    }
    else if (inParentStorylineOf(previousPage, currentPage, pages)) {
      return getStorylinePageTransition(previousPage);
    }
  };

  function inParentStorylineOf(page, otherPage, pages) {
    var parentPage = getParentPage(page, pages);

    return entryData.getStorylineIdByPagePermaId(parentPage.page('getPermaId')) ==
      entryData.getStorylineIdByPagePermaId(otherPage.page('getPermaId'));
  }

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

  function getStorylinePageTransition(page) {
    var storylineConfiguration = getStorylineConfiguration(page);
    return storylineConfiguration.page_transition || 'scroll_over_from_right';
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
