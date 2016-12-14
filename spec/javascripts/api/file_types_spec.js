describe('FileTypes', function() {
  describe('#register/#setup', function() {
    it('creates file types for given server side configs from registered client side configs',
       function() {
         var fileTypes = new pageflow.FileTypes();

         fileTypes.register('image_files', {model: pageflow.ImageFile, matchUpload: /^image/});
         fileTypes.setup([{collectionName: 'image_files'}]);

         expect(fileTypes.first().collectionName).to.eq('image_files');
         expect(fileTypes.first().model).to.eq(pageflow.ImageFile);
       });

    it('creates nested file types for given server side configs from registered ' +
       'client side configs', function() {
         var fileTypes = new pageflow.FileTypes();

         fileTypes.register('video_files', {model: pageflow.VideoFile, matchUpload: /^video/});
         fileTypes.register('text_track_files',
                            {model: pageflow.TextTrackFile, matchUpload: /^text_track/});
         fileTypes.setup([{collectionName: 'video_files',
                           nestedFileTypes: [{collectionName: 'text_track_files'}]},
                          {collectionName: 'text_track_files'}]);

         var nestedFileType = fileTypes.findByCollectionName('video_files').nestedFileTypes.first();
         expect(nestedFileType.collectionName).to.eq('text_track_files');
         expect(nestedFileType.model).to.eq(pageflow.TextTrackFile);
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

    it('allows adding additional configurationUpdaters', function() {
      var fileTypes = new pageflow.FileTypes();
      var updater1 = function() {};
      var updater2 = function() {};

      fileTypes.register('image_files', {
        model: pageflow.ImageFile,
        matchUpload: /^image/,
        configurationUpdaters: [updater1]
      });
      fileTypes.modify('image_files', {
        configurationUpdaters: [updater2]
      });

      fileTypes.setup([{collectionName: 'image_files'}]);

      expect(fileTypes.first().configurationUpdaters).to.eql([updater1, updater2]);
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
});
