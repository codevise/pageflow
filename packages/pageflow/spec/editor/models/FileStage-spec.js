describe('FileStage', function() {
  describe('progress attribute', function() {
    it('is updated from corresponding file progress attribute', function() {
      var file = new Backbone.Model({uploading_progress: 0});
      var fileStage = new pageflow.FileStage({name: 'uploading'}, {file: file});

      file.set('uploading_progress', 20);

      expect(fileStage.get('progress')).to.eq(20);
    });
  });

  describe('error_message attribute', function() {
    it('is updated from corresponding file error_message attribute', function() {
      var file = new Backbone.Model();
      var fileStage = new pageflow.FileStage({name: 'uploading'}, {file: file});

      file.set({uploading_error_message: 'error message', state: 'uploading_failed'});

      expect(fileStage.get('error_message')).to.eq('error message');
    });
  });

  describe('localizedDescription', function() {
    support.useFakeTranslations({
      'pageflow.editor.files.stages.uploading.pending': 'Upload pending',
      'pageflow.editor.files.stages.image_file.uploading.pending': 'Image upload pending'
    });

    it('constructs translation key from name and state', function() {
      var file = new Backbone.Model();
      var fileStage = new pageflow.FileStage({name: 'uploading'}, {file: file});

      expect(fileStage.localizedDescription()).to.eq('Upload pending');
    });

    it('prefers file model specific translation', function() {
      var file = new Backbone.Model();
      file.i18nKey = 'image_file';
      var fileStage = new pageflow.FileStage({name: 'uploading'}, {file: file});

      expect(fileStage.localizedDescription()).to.eq('Image upload pending');
    });
  });
});