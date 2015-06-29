pageflow.EntryData = pageflow.Object.extend({
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

  getParentChapterId: function(chapterId) {
    var pagePermaId = this.getParentPagePermaId(chapterId);
    return pagePermaId && this.getChapterIdByPagePermaId(pagePermaId);
  },

  getParentPagePermaId: function(chapterId) {
    return this.getChapterConfiguration(chapterId).parent_page_perma_id;
  }
});