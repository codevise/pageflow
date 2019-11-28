import {EditorApi, FileUploader, FilesCollection, ImageFile, InvalidNestedTypeError, NestedTypeError, TextTrackFile} from '$pageflow/editor';

import * as support from '$support';
import sinon from 'sinon';

describe('FileUploader', () => {
  let testContext;

  beforeEach(() => {
    testContext = {};
  });

  beforeEach(() => {
    testContext.fileTypes = support.factories.fileTypes(function() {
      this.withImageFileType();
      this.withVideoFileType();
      this.withTextTrackFileType();
    });

    testContext.imageFileType = testContext.fileTypes.findByCollectionName('image_files');
    testContext.videoFileType = testContext.fileTypes.findByCollectionName('video_files');
    testContext.textTrackFileType = testContext.fileTypes.findByCollectionName('text_track_files');

    testContext.entry = support.factories.entry({}, {
      files: FilesCollection.createForFileTypes([testContext.imageFileType,
                                                 testContext.videoFileType,
                                                 testContext.textTrackFileType], {}),
      fileTypes: testContext.fileTypes
    });
  });

  describe('#add', () => {
    describe('non-nested file', () => {
      it('adds file to files collection of file type', () => {
        var fileUploader = new FileUploader({
          entry: testContext.entry,
          fileTypes: testContext.fileTypes
        });
        var upload = {name: 'image.png', type: 'image/png'};

        fileUploader.add(upload);

        expect(testContext.entry.getFileCollection(testContext.imageFileType).length).toBe(1);
      });

      it(
        'returns promise that resolves to file when FileUploader#submit is called',
        () => {
          var fileUploader = new FileUploader({
            entry: testContext.entry,
            fileTypes: testContext.fileTypes
          });
          var upload = {name: 'image.png', type: 'image/png'};
          var result;

          fileUploader.add(upload).then(function(file) {
            result = file;
          });
          fileUploader.submit();

          expect(result).toBeInstanceOf(ImageFile);
        }
      );

      it(
        'returns promise that is rejected when FileUploader#abort is called',
        () => {
          var fileUploader = new FileUploader({
            entry: testContext.entry,
            fileTypes: testContext.fileTypes
          });
          var upload = {name: 'image.png', type: 'image/png'};

          var promise = fileUploader.add(upload);
          fileUploader.abort();

          expect(promise.state()).toBe('rejected');
        }
      );

      it('emits new:batch event on first add', () => {
        var fileUploader = new FileUploader({
          entry: testContext.entry,
          fileTypes: testContext.fileTypes
        });
        var upload = {name: 'image.png', type: 'image/png'};
        var handler = sinon.spy();

        fileUploader.on('new:batch', handler);
        fileUploader.add(upload);
        fileUploader.add(upload);

        expect(handler).toHaveBeenCalledOnce();
      });

      it('emits new:batch event on first add after abort', () => {
        var fileUploader = new FileUploader({
          entry: testContext.entry,
          fileTypes: testContext.fileTypes
        });
        var upload = {name: 'image.png', type: 'image/png'};
        var handler = sinon.spy();

        fileUploader.on('new:batch', handler);
        fileUploader.add(upload);
        fileUploader.abort();
        fileUploader.add(upload);

        expect(handler).toHaveBeenCalledTwice();
      });

      it('emits new:batch event on first add after submit', () => {
        var fileUploader = new FileUploader({
          entry: testContext.entry,
          fileTypes: testContext.fileTypes
        });
        var upload = {name: 'image.png', type: 'image/png'};
        var handler = sinon.spy();

        fileUploader.on('new:batch', handler);
        fileUploader.add(upload);
        fileUploader.submit();
        fileUploader.add(upload);

        expect(handler).toHaveBeenCalledTwice();
      });

      it('throws exception if target set', () => {
        var fileUploader = new FileUploader({
          entry: testContext.entry,
          fileTypes: testContext.fileTypes
        });
        var targetFileUpload = {name: 'video.mp4', type: 'video/mp4'};
        fileUploader.add(targetFileUpload);
        fileUploader.submit();
        var targetFile = testContext.entry.getFileCollection(testContext.videoFileType).first();
        var nonNestedUpload = {name: 'nested_video.mp4', type: 'video/mp4'};
        var editor = new EditorApi();
        editor.setUploadTargetFile(targetFile);

        expect(function() {
          fileUploader.add(nonNestedUpload, {editor: editor});
        }).toThrowError(InvalidNestedTypeError);
      });
    });

    describe('nested file', () => {
      it(
        'adds file to nested files collection of file type on target file',
        () => {
          var fileUploader = new FileUploader({
            entry: testContext.entry,
            fileTypes: testContext.fileTypes
          });
          var targetFileUpload = {name: 'video.mp4', type: 'video/mp4'};
          fileUploader.add(targetFileUpload);
          fileUploader.submit();
          var targetFile = testContext.entry.getFileCollection(testContext.videoFileType).first();
          var nestedFileUpload = {name: 'text_track.vtt', type: 'text/vtt'};
          var editor = new EditorApi();
          editor.setUploadTargetFile(targetFile);
          fileUploader.add(nestedFileUpload, {editor: editor});
          expect(editor.nextUploadTargetFile.nestedFiles(
            testContext.entry.getFileCollection(testContext.textTrackFileType)
          ).length).toBe(1);
        }
      );

      it(
        'resolves to file without the need to call any external function',
        () => {
          var fileUploader = new FileUploader({
            entry: testContext.entry,
            fileTypes: testContext.fileTypes
          });
          var targetFileUpload = {name: 'video.mp4', type: 'video/mp4'};
          fileUploader.add(targetFileUpload);
          fileUploader.submit();
          var targetFile = testContext.entry.getFileCollection(testContext.videoFileType).first();
          var nestedFileUpload = {name: 'text_track.vtt', type: 'text/vtt'};
          var editor = new EditorApi();
          editor.setUploadTargetFile(targetFile);
          var result;
          fileUploader.add(nestedFileUpload, {editor: editor}).then(function(file) {
            result = file;
          });
          expect(result).toBeInstanceOf(TextTrackFile);
        }
      );

      it('throws exception if target not set', () => {
        var fileUploader = new FileUploader({
          entry: testContext.entry,
          fileTypes: testContext.fileTypes
        });
        var nestedFileUpload = {name: 'text_track.vtt', type: 'text/vtt'};
        var editor = new EditorApi();

        expect(function() {
          fileUploader.add(nestedFileUpload, {editor: editor});
        }).toThrowError(NestedTypeError);
      });

      it(
        'throws exception if target does not allow to nest type of file',
        () => {
          var fileUploader = new FileUploader({
            entry: testContext.entry,
            fileTypes: testContext.fileTypes
          });
          var targetFileUpload = {name: 'video.mp4', type: 'video/mp4'};
          fileUploader.add(targetFileUpload);
          fileUploader.submit();
          var targetFile = testContext.entry.getFileCollection(testContext.videoFileType).first();
          var nestedFileUpload = {name: 'cannot_nest_image.png', type: 'image/png'};
          var editor = new EditorApi();
          editor.setUploadTargetFile(targetFile);

          expect(function() {
            fileUploader.add(nestedFileUpload, {editor: editor});
          }).toThrowError(InvalidNestedTypeError);
        }
      );
    });
  });

  describe('#abort', () => {
    it('removes the files from the files collection', () => {
      var fileUploader = new FileUploader({
        entry: testContext.entry,
        fileTypes: testContext.fileTypes
      });
      var upload = {name: 'image.png', type: 'image/png'};

      fileUploader.add(upload);
      fileUploader.abort();

      expect(testContext.entry.getFileCollection(testContext.imageFileType).length).toBe(0);
    });
  });
});
