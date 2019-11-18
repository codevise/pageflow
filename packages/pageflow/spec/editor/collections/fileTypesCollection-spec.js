import {FileTypes, ImageFile, UnmatchedUploadError, VideoFile} from '$pageflow/editor';

describe('FileTypesCollection', () => {
  describe('#findByUpload', () => {
    test(
      'returns first FileType whose matchUpload method returns true',
      () => {
        var fileTypes = new FileTypes();
        var upload = {type: 'video/mp4'};

        fileTypes.register('image_files', {
          model: ImageFile,
          matchUpload: function(upload) {
            return upload.type.match(/^image/);
          }
        });
        fileTypes.register('video_files', {
          model: VideoFile,
          matchUpload: function(upload) {
            return upload.type.match(/^video/);
          }
        });
        fileTypes.setup([
          {collectionName: 'image_files'},
          {collectionName: 'video_files'}
        ]);

        var result = fileTypes.findByUpload(upload);

        expect(result.collectionName).toBe('video_files');
      }
    );

    test(
      'returns first FileType whose uploadType matches type of upload',
      () => {
        var fileTypes = new FileTypes();
        var upload = {type: 'video/mp4'};

        fileTypes.register('image_files', {
          model: ImageFile,
          matchUpload: /^image/
        });
        fileTypes.register('video_files', {
          model: VideoFile,
          matchUpload: /^video/
        });
        fileTypes.setup([
          {collectionName: 'image_files'},
          {collectionName: 'video_files'}
        ]);

        var result = fileTypes.findByUpload(upload);

        expect(result.collectionName).toBe('video_files');
      }
    );

    test('throws exception if no file type matches', () => {
      var fileTypes = new FileTypes();
      var upload = {type: 'video/mp4'};

      fileTypes.setup([]);

      expect(function() {
        fileTypes.findByUpload(upload);
      }).toThrowError(UnmatchedUploadError);
    });
  });

  describe('#findByCollectionName', () => {
    test('returns file type with given collection name', () => {
      var fileTypes = new FileTypes();

      fileTypes.register('image_files', {
        model: ImageFile,
        matchUpload: /^image/
      });
      fileTypes.register('video_files', {
        model: VideoFile,
        matchUpload: /^video/
      });
      fileTypes.setup([
        {collectionName: 'image_files'},
        {collectionName: 'video_files'}
      ]);

      var result = fileTypes.findByCollectionName('video_files');

      expect(result.collectionName).toBe('video_files');
    });

    test(
      'throws exception if no file type with collection name exists',
      () => {
        var fileTypes = new FileTypes();

        fileTypes.setup([]);

        expect(function() {
          fileTypes.findByCollectionName('video_files');
        }).toThrowError('Could not find file type');
      }
    );
  });
});
