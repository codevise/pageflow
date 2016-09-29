pageflow.app.addInitializer(function(options) {
  pageflow.fileUploader = new pageflow.FileUploader({
    entry: pageflow.entry,
    fileTypes: pageflow.editor.fileTypes
  });
});
