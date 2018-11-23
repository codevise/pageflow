pageflow.UploaderView = Backbone.Marionette.View.extend({
  el: 'form#upload',

  ui: {
    input: 'input:file'
  },

  initialize: function() {
    this.listenTo(pageflow.app, 'request-upload', this.openFileDialog);
  },

  render: function() {
    var that = this;

    this.bindUIElements();

    var fileInput = this.ui.input;
    fileInput.fileupload({
      fileInput: fileInput,
      type: 'POST',
      autoUpload: false,
      paramName: 'file',
      dataType: 'XML',
      replaceFileInput: false,
      acceptFileTypes: new RegExp('(\\.|\\/)(bmp|gif|jpe?g|png|ti?f|wmv|mp4|mpg|mov|asf|asx|avi|' +
        'm?v|mpeg|qt|3g2|3gp|3ivx|divx|3vx|vob|flv|dvx|xvid|mkv|vtt)$',
        'i'),
      add: function(event, data) {
        try {
          pageflow.fileUploader.add(data.files[0]).then(function (record) {
            data.record = record;

            var s3UplopadConfig = record.get('s3_direct_upload_config');
            this.host = s3UplopadConfig.host;
            data.url = s3UplopadConfig.url;
            data.formData = s3UplopadConfig.fields;
            data.submit();
            data.record.upload();
          });
        }
        catch(e) {
          if (e instanceof pageflow.UploadError) {
            pageflow.app.trigger('error', e);
          }
          else {
            throw(e);
          }
        }
      },

      progress: function(event, data) {
        data.record.set('uploading_progress', parseInt(data.loaded / data.total * 100, 10));
      },

      done: function(event, data) {
        data.record.unset('uploading_progress');
        data.record.set(data.result);

        data.record.publish();
      },

      fail: function(event, data) {
        if (data.errorThrown !== 'abort') {
          data.record.uploadFailed();
        }
      },

      always: function(event, data) {
        that.stopListening(data.record);
      }
    });

    return this;
  },

  openFileDialog: function() {
    this.ui.input.click();
  }
});
