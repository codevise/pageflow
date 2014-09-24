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

  files: function(collectionName, handler, payload) {
    this.region.show(new pageflow.FilesView({
      model: this.entry,
      selectionHandler: handler && pageflow.editor.createFileSelectionHandler(handler, payload),
      tabName: collectionName
    }));
  },

  confirmableFiles: function(preselectedFileType, preselectedFileId) {
    this.region.show(pageflow.ConfirmEncodingView.create({
      model: pageflow.EncodingConfirmation.createWithPreselection({
        fileType: preselectedFileType,
        fileId: preselectedFileId
      })
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
