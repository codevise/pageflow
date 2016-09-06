describe('FileTypesCollection', function() {
  describe('#findByUpload', function() {
    it('returns first FileType whose matchUpload method returns true', function() {
      var fileTypes = new pageflow.FileTypes();
      var upload = {type: 'video/mp4'};

      fileTypes.register('image_files', {
        model: pageflow.ImageFile,
        matchUpload: function(upload) {
          return upload.type.match(/^image/);
        }
      });
      fileTypes.register('video_files', {
        model: pageflow.VideoFile,
        matchUpload: function(upload) {
          return upload.type.match(/^video/);
        }
      });
      fileTypes.setup([
        {collectionName: 'image_files'},
        {collectionName: 'video_files'}
      ]);

      var result = fileTypes.findByUpload(upload);

      expect(result.collectionName).to.eq('video_files');
    });

    it('returns first FileType whose uploadType matches type of upload', function() {
      var fileTypes = new pageflow.FileTypes();
      var upload = {type: 'video/mp4'};

      fileTypes.register('image_files', {
        model: pageflow.ImageFile,
        matchUpload: /^image/
      });
      fileTypes.register('video_files', {
        model: pageflow.VideoFile,
        matchUpload: /^video/
      });
      fileTypes.setup([
        {collectionName: 'image_files'},
        {collectionName: 'video_files'}
      ]);

      var result = fileTypes.findByUpload(upload);

      expect(result.collectionName).to.eq('video_files');
    });

    it('throws exception if no file type matches', function() {
      var fileTypes = new pageflow.FileTypes();
      var upload = {type: 'video/mp4'};

      fileTypes.setup([]);

      expect(function() {
        fileTypes.findByUpload(upload);
      }).to.throw(pageflow.UnmatchedUploadError);
    });
  });

  describe('#findByCollectionName', function() {
    it('returns file type with given collection name', function() {
      var fileTypes = new pageflow.FileTypes();

      fileTypes.register('image_files', {
        model: pageflow.ImageFile,
        matchUpload: /^image/
      });
      fileTypes.register('video_files', {
        model: pageflow.VideoFile,
        matchUpload: /^video/
      });
      fileTypes.setup([
        {collectionName: 'image_files'},
        {collectionName: 'video_files'}
      ]);

      var result = fileTypes.findByCollectionName('video_files');

      expect(result.collectionName).to.eq('video_files');
    });

    it('throws exception if no file type with collection name exists', function() {
      var fileTypes = new pageflow.FileTypes();

      fileTypes.setup([]);

      expect(function() {
        fileTypes.findByCollectionName('video_files');
      }).to.throw('Could not find file type');
    });
  });
});
