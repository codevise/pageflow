describe('FileCollection', function() {
  var Model = Backbone.Model.extend({});

  describe('.createForFileTypes', function() {
    it('creates file collections index by collection name', function() {
      var fileTypes = [new pageflow.FileType({collectionName: 'image_files', model: Model, matchUpload: /^image/})];
      var files = {
        image_files: [{file_name: 'image.png'}]
      };
      var collections = pageflow.FilesCollection.createForFileTypes(fileTypes, files);

      expect(collections.image_files.name).to.eq('image_files');
      expect(collections.image_files.model).to.eq(Model);
    });

    it('allows passing options to collection constructors', function() {
      var fileTypes = [new pageflow.FileType({collectionName: 'image_files', model: Model, matchUpload: /^image/})];
      var files = {
        image_files: [{file_name: 'image.png'}]
      };
      var entry = {};
      var collections = pageflow.FilesCollection.createForFileTypes(fileTypes, files, {entry: entry});

      expect(collections.image_files.entry).to.eq(entry);
    });
  });

  describe('#uploadable', function() {
    it('always contains subset of files with state uploadable', function() {
      var fileType = new pageflow.FileType({
        collectionName: 'image_files',
        model: Model,
        matchUpload: /^image/
      });
      var files = {
        image_files: [{
          file_name: 'image.png'
        }]
      };
      var entry = {};
      var collection = pageflow.FilesCollection.createForFileType(fileType, files, {entry: entry});

      var uploadableFiles = collection.uploadable();
      collection.first().set('state', 'uploadable');

      expect(uploadableFiles.length).to.eq(1);
    });
  });
});