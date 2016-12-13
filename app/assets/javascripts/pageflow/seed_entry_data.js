pageflow.SeedEntryData = pageflow.EntryData.extend({
  initialize: function(options) {
    this.theming = options.theming;

    this.storylineConfigurations = _(options.storylines).reduce(function(memo, storyline) {
      memo[storyline.id] = storyline.configuration;
      return memo;
    }, {});

    this.storylineIdsByChapterIds = _(options.chapters).reduce(function(memo, chapter) {
      memo[chapter.id] = chapter.storyline_id;
      return memo;
    }, {});

    this.chapterConfigurations = _.reduce(options.chapters, function(memo, chapter) {
      memo[chapter.id] = chapter.configuration;
      return memo;
    }, {});

    this.chapterPagePermaIds = _(options.pages).reduce(function(memo, page) {
      memo[page.chapter_id] = memo[page.chapter_id] || [];
      memo[page.chapter_id].push(page.perma_id);
      return memo;
    }, {});

    this.chapterIdsByPagePermaIds = _(options.pages).reduce(function(memo, page) {
      memo[page.perma_id] = page.chapter_id;
      return memo;
    }, {});

    this.pageConfigurations = _.reduce(options.pages, function(memo, page) {
      memo[page.perma_id] = page.configuration;
      return memo;
    }, {});

    this.pagePositions = _.reduce(options.pages, function(memo, page, index) {
      memo[page.perma_id] = index;
      return memo;
    }, {});
  },

  getThemingOption: function(name) {
    return this.theming[name];
  },

  getChapterConfiguration: function(id) {
    return this.chapterConfigurations[id] || {};
  },

  getChapterPagePermaIds: function(id) {
    return this.chapterPagePermaIds[id];
  },

  getPageConfiguration: function(permaId) {
    return this.pageConfigurations[permaId] || {};
  },

  getPagePosition: function(permaId) {
    return this.pagePositions[permaId];
  },

  getChapterIdByPagePermaId: function(permaId) {
    return this.chapterIdsByPagePermaIds[permaId];
  },

  getStorylineConfiguration: function(id) {
    return this.storylineConfigurations[id] || {};
  },

  getStorylineIdByChapterId: function(id) {
    return this.storylineIdsByChapterIds[id];
  }
});