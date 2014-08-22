pageflow.app.addInitializer(function(options) {
  pageflow.imageFiles = new pageflow.ImageFilesCollection(options.imageFiles);
  pageflow.videoFiles = new pageflow.VideoFilesCollection(options.videoFiles);
  pageflow.audioFiles = new pageflow.AudioFilesCollection(options.audioFiles);

  pageflow.pages = new pageflow.PagesCollection(options.pages);
  pageflow.chapters = new pageflow.ChaptersCollection(options.chapters);
  pageflow.entry = new pageflow.Entry(options.entry);

  pageflow.pages.sort();

  pageflow.editor.failures.watch(pageflow.entry);
  pageflow.editor.failures.watch(pageflow.pages);
  pageflow.editor.failures.watch(pageflow.chapters);

  pageflow.savingRecords = new pageflow.SavingRecordsCollection();
  pageflow.savingRecords.watch(pageflow.pages);
  pageflow.savingRecords.watch(pageflow.chapters);
});
