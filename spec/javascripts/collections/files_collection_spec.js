describe('FileCollection', function() {
  var f = support.factories;

  describe('.createForFileTypes', function() {
    it('creates file collections index by collection name', function() {
      var fileType = f.imageFileType();
      var files = {
        image_files: [{file_name: 'image.png'}]
      };
      var collections = pageflow.FilesCollection.createForFileTypes([fileType], files);

      expect(collections.image_files.name).to.eq('image_files');
      expect(collections.image_files.model).to.eq(fileType.model);
    });

    it('allows passing options to collection constructors', function() {
      var fileType = f.imageFileType();
      var files = {
        image_files: [{file_name: 'image.png'}]
      };
      var entry = {};
      var collections = pageflow.FilesCollection.createForFileTypes([fileType], files, {entry: entry});

      expect(collections.image_files.entry).to.eq(entry);
    });

    it('sets file type on created file models', function() {
      var fileType = f.imageFileType();
      var files = {
        image_files: [{file_name: 'image.png'}]
      };
      var entry = {};
      var collection = pageflow.FilesCollection.createForFileTypes([fileType], files);

      expect(collection.image_files.first().fileType()).to.eq(fileType);
    });
  });

  describe('.createForFileType', function() {
    it('passes fileType to files', function() {
      var fileType = f.imageFileType();
      var files = [{file_name: 'image.png'}];
      var entry = {};
      var collection = pageflow.FilesCollection.createForFileType(fileType, files, {entry: entry});

      expect(collection.first().fileType()).to.eq(fileType);
    });
  });

  describe('#uploadable', function() {
    it('always contains subset of files with state uploadable', function() {
      var fileType = f.fileType();
      var files = [{
        file_name: 'image.png'
      }];
      var entry = {};
      var collection = pageflow.FilesCollection.createForFileType(fileType, files, {entry: entry});

      var uploadableFiles = collection.uploadable();
      collection.first().set('state', 'uploadable');

      expect(uploadableFiles.length).to.eq(1);
    });
  });

  describe('#withFilter', function() {
    it('always contains subset of files matching given filter', function() {
      var fileType = f.fileType({
        filters: [
          {
            name: 'with_custom_field',
            matches: function(file) {
              return !!file.configuration.get('custom');
            }
          }
        ]
      });
      var files = [
        {
          file_name: 'image.png'
        },
        {
          file_name: 'other.png'
        }
      ];
      var entry = {};
      var collection = pageflow.FilesCollection.createForFileType(fileType, files, {entry: entry});

      var uploadableFiles = collection.withFilter('with_custom_field');
      collection.first().configuration.set('custom', 'some value');

      expect(uploadableFiles.length).to.eq(1);
    });
  });

  describe('#fetch', function() {
    it('sets file type on fetched file models', function() {
      var fileType = f.fileType();
      var files = [{
        file_name: 'image.png'
      }];
      var entry = {};
      var collection = pageflow.FilesCollection.createForFileType(fileType, [], {entry: entry});

      collection.sync = function(method, collecton, options) {
        options.success(files);
      };

      collection.fetch();

      expect(collection.first().fileType()).to.eq(fileType);
    });
  });
});
