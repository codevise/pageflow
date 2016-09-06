pageflow.UnmatchedUploadError = pageflow.Object.extend({
  name: 'UnmatchedUploadError',

  initialize: function(upload) {
    this.upload = upload;
    this.message = 'No matching file type found for upload "' + upload.name + '" of type "' +
      upload.type +'".';
  }
});
