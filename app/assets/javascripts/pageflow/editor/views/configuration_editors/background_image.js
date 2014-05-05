pageflow.ConfigurationEditorView.register('background_image', {
  configure: function() {
    this.tab('general', function() {
      this.group('general');
    });

    this.tab('files', function() {
      this.input('background_image_id', pageflow.FileInputView, {collection: pageflow.imageFiles});
    });

    this.tab('options', function() {
      this.group('options');
    });
  }
});