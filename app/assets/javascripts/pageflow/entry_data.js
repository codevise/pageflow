pageflow.EntryData = pageflow.Object.extend({
  getThemingOption: function(name) {
    throw 'Not implemented';
  },

  getPageConfiguration: function(permaId) {
    throw 'Not implemented';
  },

  getChapterConfiguration: function(id) {
    throw 'Not implemented';
  },

  getChapterIdByPagePermaId: function(permaId) {
    throw 'Not implemented';
  },

  getChapterPagePermaIds: function(id) {
    throw 'Not implemented';
  },

  getParentPagePermaIdByPagePermaId: function(permaId) {
    var chapterId = this.getChapterIdByPagePermaId(permaId);
    return this.getParentPagePermaId(chapterId);
  },

  getParentChapterId: function(chapterId) {
    var pagePermaId = this.getParentPagePermaId(chapterId);
    return pagePermaId && this.getChapterIdByPagePermaId(pagePermaId);
  },

  getParentPagePermaId: function(chapterId) {
    return this.getChapterConfiguration(chapterId).parent_page_perma_id;
  }
});