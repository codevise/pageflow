
pageflow.PageConfigurationFileSelectionHandler = function(options) {
  pageflow.ConfigurationEditorView.register('audio_loop', {
    configure: function() {
      this.tab('general', function() {
        this.group('general');

        this.input('additional_title', pageflow.TextInputView);
        this.input('additional_description', pageflow.TextAreaInputView, {size: 'short'});
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
  var page = pageflow.pages.get(options.id);

  this.call = function(file) {
    page.configuration.setReference(options.attributeName, file);
  };

  this.getReferer = function() {
    return '/pages/' + page.id + '/files';
  };
};

pageflow.editor.registerFileSelectionHandler('pageConfiguration', pageflow.PageConfigurationFileSelectionHandler);
