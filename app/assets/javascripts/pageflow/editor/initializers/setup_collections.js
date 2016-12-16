pageflow.app.addInitializer(function(options) {
  pageflow.files = pageflow.FilesCollection.createForFileTypes(pageflow.editor.fileTypes, options.files);

  pageflow.imageFiles = pageflow.files.image_files;
  pageflow.videoFiles = pageflow.files.video_files;
  pageflow.audioFiles = pageflow.files.audio_files;
  pageflow.textTrackFiles = pageflow.files.text_track_files;

  pageflow.pages = new pageflow.PagesCollection(options.pages);
  pageflow.chapters = new pageflow.ChaptersCollection(options.chapters);
  pageflow.storylines = new pageflow.StorylinesCollection(options.storylines);
  pageflow.entry = new pageflow.Entry(options.entry);
  pageflow.theming = new pageflow.Theming(options.theming);
  pageflow.account = new Backbone.Model(options.account);

  pageflow.entryData = new pageflow.PreviewEntryData({
    storylines: pageflow.storylines,
    chapters: pageflow.chapters,
    pages: pageflow.pages,
    theming: pageflow.theming
  });

  pageflow.storylineOrdering = new pageflow.StorylineOrdering(pageflow.storylines, pageflow.pages);
  pageflow.storylineOrdering.sort({silent: true});
  pageflow.storylineOrdering.watch();

  pageflow.pages.sort();

  // TODO
  pageflow.storylines.on('sort', _.debounce(function() {
    pageflow.storylines.saveOrder();
  }, 100));

  pageflow.editor.failures.watch(pageflow.entry);
  pageflow.editor.failures.watch(pageflow.pages);
  pageflow.editor.failures.watch(pageflow.chapters);

  pageflow.savingRecords = new pageflow.SavingRecordsCollection();
  pageflow.savingRecords.watch(pageflow.pages);
  pageflow.savingRecords.watch(pageflow.chapters);

  pageflow.events.trigger('seed:loaded');
});
