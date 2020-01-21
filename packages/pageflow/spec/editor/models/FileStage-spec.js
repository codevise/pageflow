import Backbone from 'backbone';

import {FileStage} from 'pageflow/editor';

import * as support from '$support';

describe('FileStage', () => {
  describe('progress attribute', () => {
    it('is updated from corresponding file progress attribute', () => {
      var file = new Backbone.Model({uploading_progress: 0});
      var fileStage = new FileStage({name: 'uploading'}, {file: file});

      file.set('uploading_progress', 20);

      expect(fileStage.get('progress')).toBe(20);
    });
  });

  describe('error_message attribute', () => {
    it('is updated from corresponding file error_message attribute', () => {
      var file = new Backbone.Model();
      var fileStage = new FileStage({name: 'uploading'}, {file: file});

      file.set({uploading_error_message: 'error message', state: 'uploading_failed'});

      expect(fileStage.get('error_message')).toBe('error message');
    });
  });

  describe('localizedDescription', () => {
    support.useFakeTranslations({
      'pageflow.editor.files.stages.uploading.pending': 'Upload pending',
      'pageflow.editor.files.stages.image_file.uploading.pending': 'Image upload pending'
    });

    it('constructs translation key from name and state', () => {
      var file = new Backbone.Model();
      var fileStage = new FileStage({name: 'uploading'}, {file: file});

      expect(fileStage.localizedDescription()).toBe('Upload pending');
    });

    it('prefers file model specific translation', () => {
      var file = new Backbone.Model();
      file.i18nKey = 'image_file';
      var fileStage = new FileStage({name: 'uploading'}, {file: file});

      expect(fileStage.localizedDescription()).toBe('Image upload pending');
    });
  });
});
