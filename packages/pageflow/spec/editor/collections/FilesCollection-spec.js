import {FilesCollection} from '$pageflow/editor';

import * as support from '$support';

describe('FileCollection', () => {
  let testContext;

  beforeEach(() => {
    testContext = {};
  });

  var f = support.factories;

  describe('.createForFileTypes', () => {
    test('creates file collections index by collection name', () => {
      var fileType = f.imageFileType();
      var files = {
        image_files: [{file_name: 'image.png'}]
      };
      var collections = FilesCollection.createForFileTypes([fileType], files);

      expect(collections.image_files.name).toBe('image_files');
      expect(collections.image_files.model).toBe(fileType.model);
    });

    test('allows passing options to collection constructors', () => {
      var fileType = f.imageFileType();
      var files = {
        image_files: [{file_name: 'image.png'}]
      };
      var entry = {};
      var collections = FilesCollection.createForFileTypes([fileType], files, {entry: entry});

      expect(collections.image_files.entry).toBe(entry);
    });

    test('sets file type on created file models', () => {
      var fileType = f.imageFileType();
      var files = {
        image_files: [{file_name: 'image.png'}]
      };
      var entry = {};
      var collection = FilesCollection.createForFileTypes([fileType], files);

      expect(collection.image_files.first().fileType()).toBe(fileType);
    });
  });

  describe('.createForFileType', () => {
    test('passes fileType to files', () => {
      var fileType = f.imageFileType();
      var files = [{file_name: 'image.png'}];
      var entry = {};
      var collection = FilesCollection.createForFileType(fileType, files, {entry: entry});

      expect(collection.first().fileType()).toBe(fileType);
    });
  });

  describe('#findOrCreateBy', () => {
    support.useFakeXhr();

    test('creates file if non with matching attributes exists', () => {
      var fileType = f.fileType();
      var files = [];
      var entry = f.entry();
      var collection = FilesCollection.createForFileType(fileType, files, {entry: entry});

      var file = collection.findOrCreateBy({source_image_id: 3});
      testContext.requests[0].respond(201, {'Content-Type': 'application/json'}, JSON.stringify({id: 5}));

      expect(file.isNew()).toBe(false);
    });

    test('sets attribute on created file', () => {
      var fileType = f.fileType();
      var files = [];
      var entry = f.entry();
      var collection = FilesCollection.createForFileType(fileType, files, {entry: entry});

      var file = collection.findOrCreateBy({source_image_id: 3});

      expect(file.get('source_image_id')).toBe(3);
    });

    test('sets fileType on created file', () => {
      var fileType = f.fileType();
      var files = [];
      var entry = f.entry();
      var collection = FilesCollection.createForFileType(fileType, files, {entry: entry});

      var file = collection.findOrCreateBy({source_image_id: 3});

      expect(file.fileType()).toBe(fileType);
    });

    test('returns existing file with matching attributes', () => {
      var fileType = f.fileType();
      var files = [{file_name: 'existing.png', source_image_id: 3}];
      var entry = f.entry();
      var collection = FilesCollection.createForFileType(fileType, files, {entry: entry});

      var file = collection.findOrCreateBy({source_image_id: 3});

      expect(file.get('file_name')).toBe('existing.png');
    });
  });

  describe('#getByPermaId', () => {
    test('returns existing file with permaId', () => {
      var fileType = f.fileType();
      var files = [{file_name: 'existing.png', perma_id: 300}];
      var entry = f.entry();
      var collection = FilesCollection.createForFileType(fileType, files, {entry: entry});

      var file = collection.getByPermaId(300);

      expect(file.get('file_name')).toBe('existing.png');
    });
  });

  describe('#uploadable', () => {
    test('always contains subset of files with state uploadable', () => {
      var fileType = f.fileType();
      var files = [{
        file_name: 'image.png'
      }];
      var entry = {};
      var collection = FilesCollection.createForFileType(fileType, files, {entry: entry});

      var uploadableFiles = collection.uploadable();
      collection.first().set('state', 'uploadable');

      expect(uploadableFiles.length).toBe(1);
    });
  });

  describe('#withFilter', () => {
    test('always contains subset of files matching given filter', () => {
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
      var collection = FilesCollection.createForFileType(fileType, files, {entry: entry});

      var uploadableFiles = collection.withFilter('with_custom_field');
      collection.first().configuration.set('custom', 'some value');

      expect(uploadableFiles.length).toBe(1);
    });
  });

  describe('#fetch', () => {
    test('sets file type on fetched file models', () => {
      var fileType = f.fileType();
      var files = [{
        file_name: 'image.png'
      }];
      var entry = {};
      var collection = FilesCollection.createForFileType(fileType, [], {entry: entry});

      collection.sync = function(method, collecton, options) {
        options.success(files);
      };

      collection.fetch();

      expect(collection.first().fileType()).toBe(fileType);
    });
  });
});
