pageflow.PreviewEntryData = pageflow.EntryData.extend({
  initialize: function(options) {
    this.storylines = options.storylines;
    this.chapters = options.chapters;
    this.pages = options.pages;
    this.theming = options.theming;
  },

  getThemingOption: function(name) {
    return this.theming.get(name);
  },

  getStorylineConfiguration: function(id) {
    var storyline = this.storylines.get(id);
    return storyline ? storyline.configuration.attributes : {};
  },

  getChapterConfiguration: function(id) {
    var chapter = this.chapters.get(id);
    return chapter ? chapter.configuration.attributes : {};
  },

  getChapterPagePermaIds: function(id) {
    var chapter = this.chapters.get(id);
    return chapter ? chapter.pages.pluck('perma_id') : [];
  },

  getStorylineIdByChapterId: function(id) {
    var chapter = this.chapters.get(id);
    return chapter && chapter.get('storyline_id');
  },

  getChapterIdByPagePermaId: function(permaId) {
    var page = this.pages.getByPermaId(permaId);
    return page && page.get('chapter_id');
  },

  getPageConfiguration: function(permaId) {
    var page = this.pages.getByPermaId(permaId);
    return page ? page.configuration.attributes : {};
  },

  getPagePosition: function(permaId) {
    return this.pages.indexOf(this.pages.getByPermaId(permaId));
  }
});
