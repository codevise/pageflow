pageflow.ConfigurationEditorView.register('video', {
  configure: function() {
    this.tab('general', function() {
      this.group('general');

      this.input('additional_title', pageflow.TextInputView);
      this.input('additional_description', pageflow.TextAreaInputView, {size: 'short'});
    });

    this.tab('files', function() {
      this.input('video_file_id', pageflow.FileInputView, {
        collection: pageflow.videoFiles,
        positioning: false
      });
      this.input('poster_image_id', pageflow.FileInputView, {
        collection: pageflow.imageFiles,
        positioning: false
      });
      this.input('thumbnail_image_id', pageflow.FileInputView, {
        collection: pageflow.imageFiles,
        positioning: false
      });
      this.input('mobile_poster_image_id', pageflow.FileInputView, {
        collection: pageflow.imageFiles,
        imagePositioning: false
      });
    });

    this.tab('options', function() {
      this.input('autoplay', pageflow.CheckBoxInputView);
      this.group('options');
    });
  }
});
