pageflow.SeedEntryData = pageflow.EntryData.extend({
  initialize: function(options) {
    this.chapterConfigurations = options.chapter_configurations;

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

  getChapterIdByPagePermaId: function(permaId) {
    return this.chapterIdsByPagePermaIds[permaId];
  }
});