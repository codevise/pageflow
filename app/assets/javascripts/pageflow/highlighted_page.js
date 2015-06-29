pageflow.HighlightedPage = pageflow.Object.extend({
  initialize: function(entryData) {
    this.entry = entryData;
  },

  getPagePermaId: function(currentPagePermaId) {
    var chapterId = this.entry.getChapterIdByPagePermaId(currentPagePermaId);

    if (this.getNavigationBarMode(chapterId) === 'inherit_from_parent') {
      var parentPagePermaId = this.entry.getParentPagePermaId(chapterId);

      return parentPagePermaId &&
        this.getPagePermaId(parentPagePermaId);
    }
    else {
      return this.getDisplayedPageInChapter(currentPagePermaId);
    }
  },

  getDisplayedPageInChapter: function(pagePermaId) {
    return _(this.getChapterPagesUntil(pagePermaId).reverse()).find(function(permaId) {
      return this.pageIsDisplayedInNavigation(permaId);
    }, this);
  },

  pageIsDisplayedInNavigation: function(permaId) {
    return this.entry.getPageConfiguration(permaId).display_in_navigation !== false;
  },

  getNavigationBarMode: function(chapterId) {
    return this.entry.getChapterConfiguration(chapterId).navigation_bar_mode;
  },

  getChapterPagesUntil: function(pagePermaId) {
    var found = false;
    var chapterId = this.entry.getChapterIdByPagePermaId(pagePermaId);

    return _.filter(this.entry.getChapterPagePermaIds(chapterId), function(other) {
      var result = !found;
      found = found || (pagePermaId === other);
      return result;
    });
  }
});

pageflow.HighlightedPage.create = function() {
  return new pageflow.HighlightedPage(pageflow.entryData);
};