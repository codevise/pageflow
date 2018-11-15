pageflow.UploaderView = Backbone.Marionette.View.extend({
  el: 'form#upload',

  initialize: function() {
    this.listenTo(pageflow.app, 'request-upload', this.openFileDialog);
  },

  render: function() {
    var that = this;

    this.bindUIElements();

    var form = this.$el;
    var fileInput = this.$('input:file');
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
        pageflow.fileUploader.add(data.files[0]).then(function (record) {
          data.record = record;

          var s3UplopadConfig = record.attributes.s3_direct_upload_config;
          form.data({host: s3UplopadConfig.host});
          fileInput.fileupload({
            url: s3UplopadConfig.url,
            formData: s3UplopadConfig.fields
          });
          data.submit();
        });
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
    this.$('input:file').click();
  }
});
