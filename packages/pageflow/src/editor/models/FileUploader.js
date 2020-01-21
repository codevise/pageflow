import $ from 'jquery';
import _ from 'underscore';

import {Object} from 'pageflow/ui';

import {InvalidNestedTypeError, NestedTypeError} from '../api/errors';
import {editor as editorApi} from '../base';

export const FileUploader = Object.extend({
  initialize: function(options) {
    this.fileTypes = options.fileTypes;
    this.entry = options.entry;

    this.deferreds = [];
  },

  add: function(upload, options) {
    options = options || {};
    var editor = options.editor || editorApi;
    var fileType = this.fileTypes.findByUpload(upload);
    var file = new fileType.model({
      state: 'uploadable',
      file_name: upload.name,
      content_type: upload.type,
      file_size: upload.size
    }, {
      fileType: fileType
    });

    var setTargetFile = editor.nextUploadTargetFile;

    if (setTargetFile){
      if (fileType.topLevelType ||
          !setTargetFile.fileType().nestedFileTypes.contains(fileType)) {
        throw(new InvalidNestedTypeError(upload, {editor: editor,
                                                           fileType: fileType}));
      }
      file.set({parent_file_id: setTargetFile.get('id'),
                parent_file_model_type: setTargetFile.fileType().typeName});
    }
    else if (!fileType.topLevelType) {
      throw(new NestedTypeError(upload, {fileType: fileType,
                                                  fileTypes: this.fileTypes}));
    }

    this.entry.getFileCollection(fileType).add(file);

    var deferred = new $.Deferred();

    if (setTargetFile) {
      deferred.resolve();
    }
    else {
      this.deferreds.push(deferred);
      if (this.deferreds.length == 1) {
        this.trigger('new:batch');
      }
    }

    return deferred.promise().then(
      function() {
        file.set('state', 'uploading');
        return file;
      },
      function() {
        file.destroy();
      });
  },

  submit: function() {
    _(this.deferreds).invoke('resolve');
    this.deferreds = [];
  },

  abort: function() {
    _(this.deferreds).invoke('reject');
    this.deferreds = [];
  }
});
