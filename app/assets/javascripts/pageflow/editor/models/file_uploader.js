pageflow.FileUploader = pageflow.Object.extend({
  initialize: function(options) {
    this.fileTypes = options.fileTypes;
    this.entry = options.entry;

    this.deferreds = [];
  },

  add: function(upload, options) {
    options = options || {};
    var editor = options.editor || pageflow.editor;
    var fileType = this.fileTypes.findByUpload(upload);
    var file = new fileType.model({
      state: 'uploadable',
      file_name: upload.name
    }, {
      fileType: fileType
    });

    if (editor.nextUploadTargetFile){
      file.set({parent_file_id: editor.nextUploadTargetFile.get('id'),
                parent_file_model_type: editor.nextUploadTargetFile.fileType().typeName});
    }

    this.entry.getFileCollection(fileType).add(file);

    var deferred = new $.Deferred();

    if (editor.nextUploadTargetFile) {
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
