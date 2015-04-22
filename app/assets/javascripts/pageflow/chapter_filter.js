pageflow.ChapterFilter = pageflow.Object.extend({
  initialize: function(entryData) {
    this.entry = entryData;
  },

  strategies: {
    all: function() {
      return true;
    },

    non: function() {
      return false;
    },

    current_chapter: function(currentChapterId, otherChapterId) {
      return otherChapterId === currentChapterId;
    },

    inherit_from_parent: function(currentChapterId, otherChapterId) {
      return this.chapterVisibleFromChapter(this.entry.getParentChapterId(currentChapterId), otherChapterId);
    },

    same_parent_page: function(currentChapterId, otherChapterId) {
      return this.entry.getParentPagePermaId(currentChapterId) === this.entry.getParentPagePermaId(otherChapterId);
    },

    same_parent_chapter: function(currentChapterId, otherChapterId) {
      return this.entry.getParentChapterId(currentChapterId) === this.entry.getParentChapterId(otherChapterId);
    }
  },

  chapterVisibleFromPage: function(currentPagePermaId, chapterId) {
    var currentChapterId = this.entry.getChapterIdByPagePermaId(currentPagePermaId);
    return this.chapterVisibleFromChapter(currentChapterId, chapterId);
  },

  chapterVisibleFromChapter: function(currentChapterId, otherChapterId) {
    return this.getStrategy(currentChapterId)
      .call(this, currentChapterId, otherChapterId);
  },

  getStrategy: function(chapterId) {
    return this.strategies[this.getNavigationBarMode(chapterId)] ||
      this.strategies.all;
  },

  getNavigationBarMode: function(chapterId) {
    return this.entry.getChapterConfiguration(chapterId).navigation_bar_mode;
  }
});

pageflow.ChapterFilter.strategies = _(pageflow.ChapterFilter.prototype.strategies).keys();

pageflow.ChapterFilter.create = function() {
  return new pageflow.ChapterFilter(pageflow.entryData);
};