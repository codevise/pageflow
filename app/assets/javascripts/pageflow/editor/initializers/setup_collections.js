pageflow.app.addInitializer(function(options) {
  pageflow.imageFiles = new pageflow.ImageFilesCollection(options.imageFiles);
  pageflow.videoFiles = new pageflow.VideoFilesCollection(options.videoFiles);
  pageflow.audioFiles = new pageflow.AudioFilesCollection(options.audioFiles);

  pageflow.pages = new pageflow.PagesCollection(options.pages);
  pageflow.chapters = new pageflow.ChaptersCollection(options.chapters);
  pageflow.entry = new pageflow.Entry(options.entry);

  pageflow.pages.sort();

  pageflow.failedRecords = new pageflow.FailedRecordsCollection();
  pageflow.failedRecords.watch(pageflow.entry);
  pageflow.failedRecords.watch(pageflow.pages);
  pageflow.failedRecords.watch(pageflow.chapters);

  pageflow.savingRecords = new pageflow.SavingRecordsCollection();
  pageflow.savingRecords.watch(pageflow.pages);
  pageflow.savingRecords.watch(pageflow.chapters);
});