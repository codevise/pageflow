pageflow.UploaderView = Backbone.Marionette.View.extend({
  el: 'form#upload',

  ui: {
    input: 'input#image_file_attachment',
    authToken: 'input[name="authenticity_token"]'
  },

  initialize: function() {
    this.listenTo(pageflow.app, 'request-upload', this.openFileDialog);
  },

  render: function() {
    var that = this;

    this.bindUIElements();

    this.$el.fileupload({
      acceptFileTypes: /(\.|\/)(bmp|gif|jpe?g|png|ti?f|wmv|mp4|mpg|mov|asf|asx|avi|m?v|mpeg|qt|3g2|3gp|3ivx|divx|3vx|vob|flv|dvx|xvid|mkv)$/i,
      dataType: 'json',

      add: function(event, data) {
        data.record = pageflow.entry.addFile(data.files[0]);
        var xhr = data.submit();

        that.listenTo(data.record, 'uploadCancelled', function() {
          xhr.abort();
        });
      },

      progress: function(event, data) {
        data.record.set('uploading_progress', parseInt(data.loaded / data.total * 100, 10));
      },

      submit: function(event, data) {
        var record = data.record;

        this.action = record.url();

        data.paramName = record.modelName + '[attachment]';
        data.formData = {
          authenticity_token: that.ui.authToken.attr('value')
        };
      },

      done: function(event, data) {
        data.record.unset('uploading_progress');
        data.record.set(data.result);
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