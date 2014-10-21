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
});