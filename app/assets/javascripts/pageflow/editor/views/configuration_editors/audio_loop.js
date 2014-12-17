pageflow.ConfigurationEditorView.register('audio_loop', {
  configure: function() {
    this.tab('general', function() {
      this.group('general');
    });

    this.tab('files', function() {
      this.input('audio_file_id', pageflow.FileInputView, {collection: pageflow.audioFiles});
      this.input('background_image_id', pageflow.FileInputView, {collection: pageflow.imageFiles});
      this.input('thumbnail_image_id', pageflow.FileInputView, {
        collection: pageflow.imageFiles,
        positioning: false
      });
    });

    this.tab('options', function() {
      this.group('options');
    });
  }
});