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

  imageFiles: function(handler, payload) {
    this.files(handler, payload, 'image_files');
  },

  videoFiles: function(handler, payload) {
    this.files(handler, payload, 'video_files');
  },

  audioFiles: function(handler, payload) {
    this.files(handler, payload, 'audio_files');
  },

  files: function(handler, payload, tabName) {
    this.region.show(new pageflow.FilesView({
      model: this.entry,
      selectionHandler: handler && pageflow.editor.createFileSelectionHandler(handler, payload),
      tabName: tabName
    }));
  },

  confirmableFiles: function() {
    this.region.show(pageflow.ConfirmEncodingView.create({
      model: new pageflow.EncodingConfirmation()
    }));
  },

  metaData: function() {
    this.region.show(new pageflow.EditMetaDataView({
      model: this.entry
    }));
  },

  publish: function() {
    this.region.show(pageflow.PublishEntryView.create({
      model: this.entry,
      entryPublication: new pageflow.EntryPublication()
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
