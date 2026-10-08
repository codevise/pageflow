import Backbone from 'backbone';
import _ from 'underscore';

import {FilesCollection, ImageFile, ThemesCollection} from 'pageflow/editor';

import * as support from '$support';

describe('Entry', () => {
  let testContext;

  const {setGlobals} = support.setupGlobals();

  beforeEach(() => {
    testContext = {};
  });

  beforeEach(() => {
    testContext.fileTypes = support.factories.fileTypesWithImageFileType();
    testContext.imageFileType = testContext.fileTypes.first();

    testContext.buildEntry = function(attributes, options) {
      const {entry} = setGlobals({entry: support.factories.entry(attributes, _.extend({
        fileTypes: testContext.fileTypes
      }, options))});

      return entry;
    };
  });

  describe('#fileFolders', () => {
    it('exposes folders passed via options', () => {
      const entry = testContext.buildEntry({}, {
        filesAttributes: {image_files: []},
        fileFoldersAttributes: [{perma_id: 1, name: 'Interviews'}]
      });

      expect(entry.fileFolders.pluck('name')).toEqual(['Interviews']);
    });
  });

  describe('#getFileCollection', () => {
    it('supports looking up via fileType object', () => {
      var imageFiles = FilesCollection.createForFileType(testContext.imageFileType, []);
      var entry = testContext.buildEntry({}, {
        files: {
          image_files: imageFiles
        }
      });

      var result = entry.getFileCollection(testContext.imageFileType);

      expect(result).toBe(imageFiles);
    });

    it('supports looking up via fileType collection name', () => {
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

  describe('#reuseFiles', () => {
    support.useFakeXhr(() => testContext);

    function filesOfOtherEntry() {
      const fileTypes = support.factories.fileTypes(function() {
        this.withImageFileType();
        this.withVideoFileType();
        this.withTextTrackFileType();
      });

      return {
        imageFile: FilesCollection.createForFileType(
          fileTypes.findByCollectionName('image_files'), [{id: 12}]
        ).first(),
        videoFile: FilesCollection.createForFileType(
          fileTypes.findByCollectionName('video_files'), [{id: 13}]
        ).first()
      };
    }

    it('posts files of all types in a single request', () => {
      const {imageFile, videoFile} = filesOfOtherEntry();
      const entry = testContext.buildEntry({id: 1}, {filesAttributes: {image_files: []}});
      const otherEntry = new Backbone.Model({id: 2});

      entry.reuseFiles(otherEntry, [imageFile, videoFile]);

      expect(testContext.requests.length).toBe(1);
      expect(testContext.requests[0].url).toBe('/editor/entries/1/file_reuses');
      expect(JSON.parse(testContext.requests[0].requestBody)).toEqual({
        file_reuse: {
          other_entry_id: 2,
          files: [
            {collection_name: 'image_files', id: 12},
            {collection_name: 'video_files', id: 13}
          ]
        }
      });
    });

    it('posts folder perma id when reusing into folder', () => {
      const {imageFile} = filesOfOtherEntry();
      const entry = testContext.buildEntry({id: 1}, {filesAttributes: {image_files: []}});
      const otherEntry = new Backbone.Model({id: 2});

      entry.reuseFiles(otherEntry, [imageFile], {folderPermaId: 5});

      expect(JSON.parse(testContext.requests[0].requestBody)).toEqual({
        file_reuse: {
          other_entry_id: 2,
          folder_perma_id: 5,
          files: [{collection_name: 'image_files', id: 12}]
        }
      });
    });

    it('adds files to files collection on success', () => {
      const {imageFile} = filesOfOtherEntry();
      const entry = testContext.buildEntry({id: 1}, {
        files: {
          image_files: FilesCollection.createForFileType(testContext.imageFileType, [])
        }
      });
      const otherEntry = new Backbone.Model({id: 2});

      testContext.server.respondWith('POST', '/editor/entries/1/file_reuses',
                                     [200, {'Content-Type': 'application/json'}, JSON.stringify({
                                       image_files: [{id: 234}]
                                     })]);

      entry.reuseFiles(otherEntry, [imageFile]);
      testContext.server.respond();

      const reusedFile = entry.getFileCollection(testContext.imageFileType).first();

      expect(reusedFile.id).toBe(234);
      expect(reusedFile.fileType()).toBe(testContext.imageFileType);
    });
  });

  describe('#refreshFiles', () => {
    support.useFakeXhr(() => testContext);

    it('adds files of entry to files collection', () => {
      var entry = testContext.buildEntry({id: 1}, {
        files: {
          image_files: FilesCollection.createForFileType(testContext.imageFileType, [])
        }
      });

      testContext.server.respondWith('GET', '/editor/entries/1',
                                     [200, {'Content-Type': 'application/json'},
                                      JSON.stringify({image_files: [{id: 234}]})]);

      entry.refreshFiles();
      testContext.server.respond();

      expect(entry.getFileCollection(testContext.imageFileType).pluck('id')).toEqual([234]);
    });

    it('keeps files that are not part of the response', () => {
      var entry = testContext.buildEntry({id: 1}, {
        files: {
          image_files: FilesCollection.createForFileType(testContext.imageFileType, [{id: 12}])
        }
      });

      testContext.server.respondWith('GET', '/editor/entries/1',
                                     [200, {'Content-Type': 'application/json'},
                                      JSON.stringify({image_files: [{id: 234}]})]);

      entry.refreshFiles();
      testContext.server.respond();

      expect(entry.getFileCollection(testContext.imageFileType).pluck('id'))
        .toEqual([12, 234]);
    });
  });

  describe('#parse', () => {
    it('updates files in files collections', () => {
      var entry = testContext.buildEntry({id: 1}, {
        files: {
          image_files: FilesCollection.createForFileType(testContext.imageFileType,
                                                         [{id: 12, state: 'uploading'}])
        }
      });

      entry.parse({
        image_files: [{id: 12, state: 'processed'}]
      });

      expect(entry.getFileCollection(testContext.imageFileType).first().get('state')).toBe('processed');
    });

    it('does not override file display_name and rights', () => {
      var entry = testContext.buildEntry({id: 1}, {
        files: {
          image_files: FilesCollection.createForFileType(
            testContext.imageFileType,
            [{id: 12, state: 'uploading', rights: '', display_name: 'old.jpg'}]
          )
        }
      });
      var imageFile = entry.getFileCollection(testContext.imageFileType).first()

      imageFile.set('rights', 'some author');
      imageFile.set('display_name', 'new.jpg');
      entry.parse({
        image_files: [{id: 12, state: 'processed', rights: '', display_name: 'old.jpg'}]
      });

      expect(imageFile.get('state')).toBe('processed');
      expect(imageFile.get('display_name')).toBe('new.jpg');
      expect(imageFile.get('rights')).toBe('some author');
    });

    it('updates last_published_with_noindex attribute', () => {
      const entry = support.factories.entry();

      entry.parse({
        last_published_with_noindex: true
      });

      expect(entry.get('last_published_with_noindex')).toEqual(true);
    })
  });

  describe('file collection count attribute', () => {
    it('is kept for each registed file type', () => {
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
    it('returns theme based on theme_name configuration attribute', () => {
      var themes = new ThemesCollection([
        {
          name: 'custom',
          page_change_by_scrolling: true
        }
      ]);
      var entry = support.factories.entry(
        {
          metadata: {theme_name: 'custom'}
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
