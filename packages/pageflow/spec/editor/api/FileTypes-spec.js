import _ from 'underscore';

import {TextInputView, TextTableCellView} from '$pageflow/ui';

import {ImageFile, TextTrackFile, VideoFile} from '$pageflow/editor';
import {FileTypes} from '$pageflow/editor/api/FileTypes';

describe('FileTypes', () => {
  describe('#register/#setup', () => {
    it(
      'creates file types for given server side configs from registered client side configs',
      () => {
        var fileTypes = new FileTypes();

        fileTypes.register('image_files', {model: ImageFile, matchUpload: /^image/});
        fileTypes.setup([{collectionName: 'image_files'}]);

        expect(fileTypes.first().collectionName).toBe('image_files');
        expect(fileTypes.first().model).toBe(ImageFile);
      }
    );

    it(
      'creates nested file types for given server side configs from registered ' +
         'client side configs',
      () => {
           var fileTypes = new FileTypes();

           fileTypes.register('video_files', {model: VideoFile, matchUpload: /^video/});
           fileTypes.register('text_track_files',
                              {model: TextTrackFile, matchUpload: /^text_track/});
           fileTypes.setup([{collectionName: 'video_files',
                             nestedFileTypes: [{collectionName: 'text_track_files'}]},
                            {collectionName: 'text_track_files'}]);

           var nestedFileType = fileTypes.findByCollectionName('video_files').nestedFileTypes.first();
           expect(nestedFileType.collectionName).toBe('text_track_files');
           expect(nestedFileType.model).toBe(TextTrackFile);
         }
    );

    it('throws exception if client side config is missing', () => {
      var fileTypes = new FileTypes();

      expect(function() {
        fileTypes.setup([{collectionName: 'image_files'}]);
      }).toThrowError(/Missing client side config/);
    });
  });

  describe('#modify', () => {
    it('allows adding additional configurationEditorInputs', () => {
      var fileTypes = new FileTypes();

      fileTypes.register('image_files', {
        model: ImageFile,
        matchUpload: /^image/,
        configurationEditorInputs: [
          {
            name: 'custom_field',
            input: TextInputView
          }
        ]
      });
      fileTypes.modify('image_files', {
        configurationEditorInputs: [
          {
            name: 'other_field',
            input: TextInputView
          }
        ]
      });

      fileTypes.setup([{collectionName: 'image_files'}]);
      var inputNames = _(fileTypes.first().configurationEditorInputs).pluck('name');

      expect(inputNames).toEqual(['custom_field', 'other_field']);
    });

    it('allows adding additional configurationUpdaters', () => {
      var fileTypes = new FileTypes();
      var updater1 = function() {};
      var updater2 = function() {};

      fileTypes.register('image_files', {
        model: ImageFile,
        matchUpload: /^image/,
        configurationUpdaters: [updater1]
      });
      fileTypes.modify('image_files', {
        configurationUpdaters: [updater2]
      });

      fileTypes.setup([{collectionName: 'image_files'}]);

      expect(fileTypes.first().configurationUpdaters).toEqual([updater1, updater2]);
    });

    it('allows adding additional confirmUploadTableColumns', () => {
      var fileTypes = new FileTypes();

      fileTypes.register('image_files', {
        model: ImageFile,
        matchUpload: /^image/,
        confirmUploadTableColumns: [
          {
            name: 'custom_field',
            cellView: TextTableCellView
          }
        ]
      });
      fileTypes.modify('image_files', {
        confirmUploadTableColumns: [
          {
            name: 'other_field',
            cellView: TextTableCellView
          }
        ]
      });

      fileTypes.setup([{collectionName: 'image_files'}]);
      var columnNames = _(fileTypes.first().confirmUploadTableColumns).pluck('name');

      expect(columnNames).toEqual(['custom_field', 'other_field']);
    });

    it('throws error when trying to modify unsupported property', () => {
      var fileTypes = new FileTypes();

      fileTypes.register('image_files', {
        model: ImageFile,
        matchUpload: /^image/,
        confirmUploadTableColumns: [
          {
            name: 'custom_field',
            cellView: TextTableCellView
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
