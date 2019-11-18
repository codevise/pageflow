import Backbone from 'backbone';
import _ from 'underscore';

import {FilesCollection, ImageFile, ThemesCollection} from '$pageflow/editor';

import * as support from '$support';

describe('Entry', () => {
  let testContext;

  beforeEach(() => {
    testContext = {};
  });

  beforeEach(() => {
    testContext.fileTypes = support.factories.fileTypesWithImageFileType();
    testContext.imageFileType = testContext.fileTypes.first();

    testContext.buildEntry = function(attributes, options) {
      return support.factories.entry(attributes, _.extend({
        fileTypes: testContext.fileTypes
      }, options));
    };
  });

  describe('#getFileCollection', () => {
    test('supports looking up via fileType object', () => {
      var imageFiles = FilesCollection.createForFileType(testContext.imageFileType, []);
      var entry = testContext.buildEntry({}, {
        files: {
          image_files: imageFiles
        }
      });

      var result = entry.getFileCollection(testContext.imageFileType);

      expect(result).toBe(imageFiles);
    });

    test('supports looking up via fileType collection name', () => {
      var imageFiles = FilesCollection.createForFileType(testContext.imageFileType, []);
      var entry = testContext.buildEntry({}, {
        files: {
          image_files: imageFiles
        }
      });

      var result = entry.getFileCollection(testContext.imageFileType.collectionName);

      expect(result).toBe(imageFiles);
    });
  });

  describe('#reuseFile', () => {
    support.useFakeXhr();

    test('posts file usage to server', () => {
      var imageFiles = FilesCollection.createForFileType(testContext.imageFileType, [{id: 12}]);
      var entry = testContext.buildEntry({id: 1}, {
        files: {
          image_files: new Backbone.Collection()
        }
      });
      var otherEntry = testContext.buildEntry({id: 2}, {
        files: {
          image_files: new Backbone.Collection()
        }
      });
      var file = imageFiles.first();

      entry.reuseFile(otherEntry, file);

      expect(testContext.requests[0].url).toBe('/editor/entries/1/files/image_files/reuse');
      expect(JSON.parse(testContext.requests[0].requestBody)).toEqual({
        file_reuse: {
          file_id: 12,
          other_entry_id: 2
        }
      });
    });

    test('adds file to files collection on success', () => {
      var entry = testContext.buildEntry({id: 1}, {
        files: {
          image_files: FilesCollection.createForFileType(this.imageFileType, [])
        }
      });
      var imageFiles = FilesCollection.createForFileType(testContext.imageFileType, [{}]);
      var otherEntry = testContext.buildEntry({id: 2}, {
        files: {
          image_files: imageFiles
        }
      });
      var file = imageFiles.first();

      testContext.server.respondWith('POST', '/editor/entries/1/files/image_files/reuse',
                              [200, {'Content-Type': 'application/json'}, JSON.stringify({
                                image_files: [{id: 234}]
                              })]);

      entry.reuseFile(otherEntry, file);
      testContext.server.respond();

      var imageFile = entry.getFileCollection(testContext.imageFileType).first();

      expect(imageFile.id).toBe(234);
      expect(imageFile.fileType()).toBe(testContext.imageFileType);
    });
  });

  describe('#parse', () => {
    test('updates files in files collections', () => {
      var entry = testContext.buildEntry({id: 1}, {
        files: {
          image_files: FilesCollection.createForFileType(this.imageFileType,
                                                                  [{id: 12, state: 'uploading'}])
        }
      });

      entry.parse({
        image_files: [{id: 12, state: 'processed'}]
      });

      expect(entry.getFileCollection(testContext.imageFileType).first().get('state')).toBe('processed');
    });
  });

  describe('file collection count attribute', () => {
    test('is kept for each registed file type', () => {
      var entry = testContext.buildEntry({}, {
        files: {
          image_files: new Backbone.Collection()
        }
      });

      entry.getFileCollection(testContext.imageFileType).add(new ImageFile({state: 'processing'}));

      expect(entry.get('pending_image_files_count')).toBe(1);
    });
  });

  describe('#getTheme', () => {
    test('returns theme based on theme_name configuration attribute', () => {
      var themes = new ThemesCollection([
        {
          name: 'custom',
          page_change_by_scrolling: true
        }
      ]);
      var entry = support.factories.entry(
        {
          configuration: {theme_name: 'custom'}
        },
        {
          themes: themes
        }
      );

      var result = entry.getTheme();

      expect(result).toBe(themes.first());
    });
  });
});
