describe('FileTypes', () => {
  describe('#register/#setup', () => {
    test(
      'creates file types for given server side configs from registered client side configs',
      () => {
        var fileTypes = new pageflow.FileTypes();

        fileTypes.register('image_files', {model: pageflow.ImageFile, matchUpload: /^image/});
        fileTypes.setup([{collectionName: 'image_files'}]);

        expect(fileTypes.first().collectionName).toBe('image_files');
        expect(fileTypes.first().model).toBe(pageflow.ImageFile);
      }
    );

    test(
      'creates nested file types for given server side configs from registered ' +
         'client side configs',
      () => {
           var fileTypes = new pageflow.FileTypes();

           fileTypes.register('video_files', {model: pageflow.VideoFile, matchUpload: /^video/});
           fileTypes.register('text_track_files',
                              {model: pageflow.TextTrackFile, matchUpload: /^text_track/});
           fileTypes.setup([{collectionName: 'video_files',
                             nestedFileTypes: [{collectionName: 'text_track_files'}]},
                            {collectionName: 'text_track_files'}]);

           var nestedFileType = fileTypes.findByCollectionName('video_files').nestedFileTypes.first();
           expect(nestedFileType.collectionName).toBe('text_track_files');
           expect(nestedFileType.model).toBe(pageflow.TextTrackFile);
         }
    );

    test('throws exception if client side config is missing', () => {
      var fileTypes = new pageflow.FileTypes();

      expect(function() {
        fileTypes.setup([{collectionName: 'image_files'}]);
      }).toThrowError(/Missing client side config/);
    });
  });

  describe('#modify', () => {
    test('allows adding additional configurationEditorInputs', () => {
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

      expect(inputNames).toEqual(['custom_field', 'other_field']);
    });

    test('allows adding additional configurationUpdaters', () => {
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

      expect(fileTypes.first().configurationUpdaters).toEqual([updater1, updater2]);
    });

    test('allows adding additional confirmUploadTableColumns', () => {
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

      expect(columnNames).toEqual(['custom_field', 'other_field']);
    });

    test('throws error when trying to modify unsupported property', () => {
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
      }).toThrowError(/Given in modification for image_files: somethingElse/);
    });
  });
});
