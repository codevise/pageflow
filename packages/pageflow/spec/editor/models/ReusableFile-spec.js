import Backbone from 'backbone';

import {FileTypesCollection, FileType, ReusableFile, SubsetCollection} from '$pageflow/editor';

import * as support from '$support';
import sinon from 'sinon';

describe('ReusableFile', () => {
  let testContext;

  beforeEach(() => {
    testContext = {};
  });

  var File = ReusableFile.extend({
    readyState: 'ready'
  });

  var FilesCollection = Backbone.Collection.extend({
    model: File,

    initialize: function(options) {
      options = options || {};
      this.fileType = options.fileType;
    }
  });

  describe('#isReady', () => {
    test('returns true if state equals readyState', () => {
      var file = new File({state: 'ready'});

      expect(file.isReady()).toBe(true);
    });
  });

  describe('#isFailed', () => {
    test('returns true if state ends with _failed', () => {
      var file = new File({state: 'uploading_failed'});

      expect(file.isFailed()).toBe(true);
    });

    test('returns false if state does not end with _failed', () => {
      var file = new File({state: 'uploading'});

      expect(file.isFailed()).toBe(false);
    });
  });

  describe('#isPending', () => {
    test('returns true if neither ready nor failed ', () => {
      var file = new File({state: 'processing'});

      expect(file.isPending()).toBe(true);
    });

    test('returns false if ready', () => {
      var file = new File({state: 'ready'});

      expect(file.isPending()).toBe(false);
    });

    test('returns false if failed', () => {
      var file = new File({state: 'processing_failed'});

      expect(file.isPending()).toBe(false);
    });
  });

  describe('#set', () => {
    var f = support.factories;

    describe('with applyConfigurationUpdaters option', () => {
      test('applies file type updaters', () => {
        var fileType = f.fileType({
          configurationUpdaters: [
            function(configuration, newAttributes) {
              configuration.set(newAttributes);
            }
          ]
        });
        var file = new File({state: 'processing', configuration: {custom: 'seed'}},
                            {fileType: fileType});
        var attributes = {configuration: {custom: 'updated'}};

        file.set(attributes, {applyConfigurationUpdaters: true});

        expect(file.configuration.get('custom')).toBe('updated');
      });
    });
  });

  describe('#toJSON', () => {
    test('includes rights, configuration and file_name', () => {
      var file = new File({
        state: 'processed',
        rights: 'someone',
        file_name: 'image_jpg',
        configuration: {
          some: 'value'
        }
      });

      expect(file.toJSON()).toEqual({
        rights: 'someone',
        file_name: 'image_jpg',
        configuration: {
          some: 'value'
        }
      });
    });
  });

  describe('#nestedFiles', () => {
    beforeEach(() => {
      testContext.textTrackFileType = new FileType({collectionName: 'text_track_files',
                                                      typeName: 'Pageflow::TextTrackFile',
                                                      model: File,
                                                      matchUpload: /^text_track/});
      testContext.imageFileType = new FileType({collectionName: 'image_files',
                                                  typeName: 'Pageflow::ImageFile',
                                                  model: File,
                                                  matchUpload: /^image/});
      testContext.videoFileType = new FileType({collectionName: 'video_files',
                                                  typeName: 'Pageflow::VideoFile',
                                                  model: File,
                                                  matchUpload: /^video/});
      testContext.videoFileType.nestedFileTypes = new FileTypesCollection([testContext.textTrackFileType,
                                                                             testContext.imageFileType]);
      testContext.textTrackFiles = new FilesCollection({fileType: testContext.textTrackFileType});
      testContext.imageFiles = new FilesCollection({fileType: testContext.imageFileType});
    });

    test('returns a SubsetCollection', () => {
      var parentFile = new File({}, {fileType: testContext.videoFileType});
      var nestedFile = new File({}, {fileType: testContext.textTrackFileType, parentFile: parentFile});
      testContext.textTrackFiles.add(nestedFile);

      expect(parentFile.nestedFiles(testContext.textTrackFiles)).toBeInstanceOf(SubsetCollection);
    });

    test('contains nested files of expected type', () => {
      var parentFile = new File({id: 43}, {fileType: testContext.videoFileType});
      var otherNestedFile = new File({file_name: 'not_nested.vtt'},
                                     {fileType: testContext.textTrackFileType});
      var nestedFile = new File({parent_file_id: parentFile.id,
                                 parent_file_model_type: 'Pageflow::VideoFile',
                                 file_name: 'nested.vtt'},
                                {fileType: testContext.textTrackFileType, parentFile: parentFile});
      testContext.textTrackFiles.add(otherNestedFile);
      testContext.textTrackFiles.add(nestedFile);

      var nestedFilesViaParent = parentFile.nestedFiles(testContext.textTrackFiles);
      var nestedFileViaParent = nestedFilesViaParent.first();

      expect(nestedFilesViaParent.length).toBe(1);
      expect(nestedFileViaParent.get('file_name')).toBe('nested.vtt');
    });

    test('returns same collection on repeated call', () => {
      var parentFile = new File({id: 43}, {fileType: testContext.videoFileType});
      var nestedFile = new File({parent_file_id: parentFile.id,
                                 parent_file_model_type: 'Pageflow::VideoFile',
                                 file_name: 'nested.vtt'},
                                {fileType: testContext.textTrackFileType, parentFile: parentFile});
      testContext.textTrackFiles.add(nestedFile);

      var nestedFileCollection = parentFile.nestedFiles(testContext.textTrackFiles);
      var nestedFileCollection2 = parentFile.nestedFiles(testContext.textTrackFiles);

      expect(nestedFileCollection).toBe(nestedFileCollection2);
    });

    test(
      'returns different backbone collection for different filetypes',
      () => {
        var parentFile = new File({id: 43}, {fileType: testContext.videoFileType});
        var nestedTextTrackFile = new File({parent_file_id: parentFile.id,
                                            parent_file_model_type: 'Pageflow::VideoFile',
                                            file_name: 'nested.vtt'},
                                           {fileType: testContext.textTrackFileType,
                                            parentFile: parentFile});
        var nestedImageFile = new File({parent_file_id: parentFile.id,
                                        parent_file_model_type: 'Pageflow::ImageFile',
                                        file_name: 'nested.tiff'},
                                       {fileType: testContext.textTrackFileType, parentFile: parentFile});
        testContext.textTrackFiles.add(nestedTextTrackFile);
        testContext.imageFiles.add(nestedImageFile);

        var nestedFileCollection = parentFile.nestedFiles(testContext.textTrackFiles);
        var nestedFileCollection2 = parentFile.nestedFiles(testContext.imageFiles);

        expect(nestedFileCollection).not.toBe(nestedFileCollection2);
      }
    );

    test('contains nested files of expected type', () => {
      var parentFile = new File({id: 43}, {fileType: testContext.videoFileType});
      var nestedFile = new File({parent_file_id: parentFile.id,
                                 parent_file_model_type: 'Pageflow::VideoFile',
                                 file_name: 'nested.vtt'},
                                {fileType: testContext.textTrackFileType, parentFile: parentFile});
      testContext.textTrackFiles.add(nestedFile);

      var nestedFileViaParent = parentFile.nestedFiles(testContext.textTrackFiles).first();

      expect(nestedFileViaParent.fileType()).toBe(testContext.textTrackFileType);
    });

    test(
      'does not contains nested files of other file with same id but different type',
      () => {
        var parentFile = new File({id: 43}, {fileType: testContext.videoFileType});
        var nestedFile = new File({parent_file_id: parentFile.id,
                                   parent_file_model_type: 'Pageflow::AudioFile',
                                   file_name: 'nested.vtt'},
                                  {fileType: testContext.textTrackFileType, parentFile: parentFile});
        testContext.textTrackFiles.add(nestedFile);

        var nestedFilesCount = parentFile.nestedFiles(testContext.textTrackFiles).length;

        expect(nestedFilesCount).toBe(0);
      }
    );
  });

  describe('changing the configuration', () => {
    test('triggers change:configuration event', () => {
      var file = new File();
      var handler = sinon.spy();

      file.on('change:configuration', handler);
      file.configuration.set('some', 'value');

      expect(handler).toHaveBeenCalled();
    });

    test(
      'triggers change:configuration:[attribute] events per changed attribute',
      () => {
        var file = new File();
        var handler = sinon.spy();

        file.on('change:configuration:some', handler);
        file.configuration.set('some', 'value');

        expect(handler).toHaveBeenCalled();
      }
    );

    test(
      'does not trigger change:configuration:[attribute] for unchanged attribute',
      () => {
        var file = new File();
        var handler = sinon.spy();

        file.configuration.set('other', 'value');
        file.on('change:configuration:other', handler);
        file.configuration.set('some', 'value');

        expect(handler).not.toHaveBeenCalled();
      }
    );
  });
});
