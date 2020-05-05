import Object from './Object'

export const EntryData = Object.extend({
  getThemingOption: function(name) {
    throw 'Not implemented';
  },

  getFile: function(collectionName, id) {
    throw 'Not implemented';
  },

  getPageConfiguration: function(permaId) {
    throw 'Not implemented';
  },

  getPagePosition: function(permaId) {
    throw 'Not implemented';
  },

  getChapterConfiguration: function(id) {
    throw 'Not implemented';
  },

  getStorylineConfiguration: function(id) {
    throw 'Not implemented';
  },

  getChapterIdByPagePermaId: function(permaId) {
    throw 'Not implemented';
  },

  getStorylineIdByChapterId: function(permaId) {
    throw 'Not implemented';
  },

  getChapterPagePermaIds: function(id) {
    throw 'Not implemented';
  },

  getParentPagePermaIdByPagePermaId: function(permaId) {
    var storylineId = this.getStorylineIdByPagePermaId(permaId);
    return this.getParentPagePermaId(storylineId);
  },

  getStorylineIdByPagePermaId: function(permaId) {
    var chapterId = this.getChapterIdByPagePermaId(permaId);
    return this.getStorylineIdByChapterId(chapterId);
  },

  getParentStorylineId: function(storylineId) {
    var parentPagePermaId = this.getParentPagePermaId(storylineId);
    return parentPagePermaId && this.getStorylineIdByPagePermaId(parentPagePermaId);
  },

  getParentChapterId: function(chapterId) {
    var storylineId = this.getStorylineIdByChapterId(chapterId);
    var pagePermaId = this.getParentPagePermaId(storylineId);
    return pagePermaId && this.getChapterIdByPagePermaId(pagePermaId);
  },

  getParentPagePermaId: function(storylineId) {
    return this.getStorylineConfiguration(storylineId).parent_page_perma_id;
  },

  getStorylineLevel: function(storylineId) {
    var parentStorylineId = this.getParentStorylineId(storylineId);

    if (parentStorylineId) {
      return this.getStorylineLevel(parentStorylineId) + 1;
    }
    else {
      return 0;
    }
  }
});
