pageflow.app.addInitializer(function(options) {
  pageflow.editor.fileTypes.register('image_files', {
    model: pageflow.ImageFile,
    metaDataAttributes: ['dimensions'],
    matchUpload: /^image/
  });

  pageflow.editor.fileTypes.register('video_files', {
    model: pageflow.VideoFile,
    metaDataAttributes: ['format', 'dimensions', 'duration'],
    matchUpload: /^video/
  });

  pageflow.editor.fileTypes.register('audio_files', {
    model: pageflow.AudioFile,
    metaDataAttributes: ['format', 'duration'],
    matchUpload: /^audio/
  });

  pageflow.editor.fileTypes.setup(options.config.fileTypes);
});
