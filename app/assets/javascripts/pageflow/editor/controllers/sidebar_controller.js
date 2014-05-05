pageflow.SidebarController = Backbone.Marionette.Controller.extend({
  initialize: function(options) {
    this.region = options.region;
    this.entry = options.entry;
  },

  index: function() {
    this.region.show(new pageflow.EditEntryView({
      model: this.entry
    }));
  },

  imageFiles: function(pageId, attributeName) {
    this.files(pageId, attributeName, 'image_files');
  },

  videoFiles: function(pageId, attributeName) {
    this.files(pageId, attributeName, 'video_files');
  },

  audioFiles: function(pageId, attributeName) {
    this.files(pageId, attributeName, 'audio_files');
  },

  files: function(pageId, attributeName, tabName) {
    this.region.show(new pageflow.FilesView({
      model: this.entry,
      page: this.entry.pages.get(pageId),
      pageAttributeName: attributeName,
      tabName: tabName
    }));
  },

  metaData: function() {
    this.region.show(new pageflow.EditMetaDataView({
      model: this.entry
    }));
  },

  publish: function() {
    this.region.show(new pageflow.PublishEntryView({
      model: this.entry
    }));
  },

  chapter: function(id) {
    this.region.show(new pageflow.EditChapterView({
      model: this.entry.chapters.get(id)
    }));
  },

  page: function(id, tab) {
    this.region.show(new pageflow.EditPageView({
      model: this.entry.pages.get(id),
      tab: tab
    }));
  }
});