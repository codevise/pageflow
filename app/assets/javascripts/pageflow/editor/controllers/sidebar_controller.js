pageflow.SidebarController = Backbone.Marionette.Controller.extend({
  initialize: function(options) {
    this.region = options.region;
    this.entry = options.entry;
  },

  index: function(storylineId) {
    this.region.show(new pageflow.EditEntryView({
      model: this.entry,
      storylineId: storylineId
    }));
  },

  files: function(collectionName, handler, payload, filterName) {
    this.region.show(new pageflow.FilesView({
      model: this.entry,
      selectionHandler: handler && pageflow.editor.createFileSelectionHandler(handler, payload),
      tabName: collectionName,
      filterName: filterName
    }));

    pageflow.editor.setDefaultHelpEntry('pageflow.help_entries.files');
  },

  confirmableFiles: function(preselectedFileType, preselectedFileId) {
    this.region.show(pageflow.ConfirmEncodingView.create({
      model: pageflow.EncodingConfirmation.createWithPreselection({
        fileType: preselectedFileType,
        fileId: preselectedFileId
      })
    }));
  },

  metaData: function(tab) {
    this.region.show(new pageflow.EditMetaDataView({
      model: this.entry,
      tab: tab
    }));
  },

  publish: function() {
    this.region.show(pageflow.PublishEntryView.create({
      model: this.entry,
      entryPublication: new pageflow.EntryPublication()
    }));

    pageflow.editor.setDefaultHelpEntry('pageflow.help_entries.publish');
  },

  storyline: function(id) {
    this.region.show(new pageflow.EditStorylineView({
      model: this.entry.storylines.get(id)
    }));
  },

  chapter: function(id) {
    this.region.show(new pageflow.EditChapterView({
      model: this.entry.chapters.get(id)
    }));
  },

  page: function(id, tab) {
    var page = this.entry.pages.get(id);

    this.region.show(new pageflow.EditPageView({
      model: page,
      tab: tab
    }));

    pageflow.editor.setDefaultHelpEntry(page.pageType().help_entry_translation_key);
  },

  pageLink: function(linkId) {
    var pageId = linkId.split(':')[0];
    var page = pageflow.pages.getByPermaId(pageId);

    this.region.show(new pageflow.EditPageLinkView({
      model: page.pageLinks().get(linkId),
      page: page
    }));
  }
});
