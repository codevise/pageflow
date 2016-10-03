describe('FileTypes', function() {
  describe('#register/#setup', function() {
    it('creates file types for given server side configs from registered client side configs', function() {
      var fileTypes = new pageflow.FileTypes();

      fileTypes.register('image_files', {model: pageflow.ImageFile, matchUpload: /^image/});
      fileTypes.setup([{collectionName: 'image_files'}]);

      expect(fileTypes.first().collectionName).to.eq('image_files');
      expect(fileTypes.first().model).to.eq(pageflow.ImageFile);
    });

    it('throws exception if client side config is missing', function() {
      var fileTypes = new pageflow.FileTypes();

      expect(function() {
        fileTypes.setup([{collectionName: 'image_files'}]);
      }).to.throw(/Missing client side config/);
    });
  });

  describe('#modify', function() {
    it('allows adding additional configurationEditorInputs', function() {
      var fileTypes = new pageflow.FileTypes();

      fileTypes.register('image_files', {
        model: pageflow.ImageFile,
        matchUpload: /^image/,
        configurationEditorInputs: [
          {
            name: 'custom_field',
            input: pageflow.TextInputView
          }
        ]
      });
      fileTypes.modify('image_files', {
        configurationEditorInputs: [
          {
            name: 'other_field',
            input: pageflow.TextInputView
          }
        ]
      });

      fileTypes.setup([{collectionName: 'image_files'}]);
      var inputNames = _(fileTypes.first().configurationEditorInputs).pluck('name');

      expect(inputNames).to.eql(['custom_field', 'other_field']);
    });

    it('allows adding additional confirmUploadTableColumns', function() {
      var fileTypes = new pageflow.FileTypes();

      fileTypes.register('image_files', {
        model: pageflow.ImageFile,
        matchUpload: /^image/,
        confirmUploadTableColumns: [
          {
            name: 'custom_field',
            cellView: pageflow.TextTableCellView
          }
        ]
      });
      fileTypes.modify('image_files', {
        confirmUploadTableColumns: [
          {
            name: 'other_field',
            cellView: pageflow.TextTableCellView
          }
        ]
      });

      fileTypes.setup([{collectionName: 'image_files'}]);
      var columnNames = _(fileTypes.first().confirmUploadTableColumns).pluck('name');

      expect(columnNames).to.eql(['custom_field', 'other_field']);
    });

    it('throws error when trying to modify unsupported property', function() {
      var fileTypes = new pageflow.FileTypes();

      fileTypes.register('image_files', {
        model: pageflow.ImageFile,
        matchUpload: /^image/,
        confirmUploadTableColumns: [
          {
            name: 'custom_field',
            cellView: pageflow.TextTableCellView
          }
        ]
      });
      fileTypes.modify('image_files', {
        somethingElse: [{}]
      });

      expect(function() {
        fileTypes.setup([{collectionName: 'image_files'}]);
      }).to.throw(/Given in modification for image_files: somethingElse/);
    });
  });

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
      }).to.throw(pageflow.FileTypes.UnmatchedUploadError);
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