pageflow.ConfigurationEditorView.register('audio', {
  configure: function() {
    this.tab('general', function() {
      this.group('general');

      this.input('additional_title', pageflow.TextInputView);
      this.input('additional_description', pageflow.TextAreaInputView, {size: 'short'});
    });

    this.tab('files', function() {
      this.input('audio_file_id', pageflow.FileInputView, {
        collection: pageflow.audioFiles,
        defaultTextTrackFilePropertyName: 'default_text_track_file_id'
      });
      this.group('background');
      this.input('thumbnail_image_id', pageflow.FileInputView, {
        collection: pageflow.imageFiles,
        positioning: false
      });
    });

    this.tab('options', function() {
      this.input('autoplay', pageflow.CheckBoxInputView);
      this.group('options', {canPauseAtmo: true});
    });
  }
});
